#!/usr/bin/env python3
"""Emit a secret-safe wake packet for the autonomous whitepaper publisher."""
from __future__ import annotations

import hashlib
import json
import os
import re
import subprocess
from datetime import datetime, timezone
from pathlib import Path

BRAIN = Path(os.environ.get("BRAIN_WHITEPAPERS_ROOT", "/Users/kublai/brain/whitepapers"))
BLOG = Path(os.environ.get("BLOG_REPO_ROOT", "/Users/kublai/blog.kurult.ai"))
STATE = Path(os.environ.get("WHITEPAPER_PUBLISH_STATE", "/Users/kublai/.hermes/profiles/kublai/cron/state/whitepaper-auto-publisher.json"))
BLOCK_COOLDOWN_SECONDS = 24 * 60 * 60


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def load_state() -> dict:
    try:
        value = json.loads(STATE.read_text())
        return value if isinstance(value, dict) else {}
    except (OSError, ValueError):
        return {}


def main() -> int:
    index_path = BRAIN / "index.md"
    manifest_path = BLOG / "content/publication-manifest.json"
    index = index_path.read_text()
    manifest = json.loads(manifest_path.read_text())

    posts: dict[str, dict] = {}
    for post in manifest.get("posts", []):
        for slug in [post.get("slug"), post.get("canonicalSlug"), *post.get("aliases", [])]:
            if slug:
                posts[slug] = post

    candidates: list[dict] = []
    rows = re.findall(
        r"^\|\s*(\d{4}-\d{2}-\d{2})\s*\|\s*(.*?)\s*\|\s*`([^`]+)`\s*\|\s*(.*?)\s*\|$",
        index,
        re.MULTILINE,
    )
    for date, title, slug, status in rows:
        if not status.strip().lower().startswith("published"):
            continue
        source = BRAIN / f"{slug}.md"
        if not source.exists():
            candidates.append({"kind": "source_missing", "date": date, "title": title, "slug": slug, "status": status.strip(), "sourcePath": str(source)})
            continue
        source_hash = digest(source)
        post = posts.get(slug)
        if post is None:
            candidates.append({"kind": "unpublished", "date": date, "title": title, "slug": slug, "status": status.strip(), "sourcePath": str(source), "sourceSha256": source_hash})
        elif post.get("sourceArtifactSha256") and post["sourceArtifactSha256"] != source_hash:
            candidates.append({"kind": "source_drift", "date": date, "title": title, "slug": slug, "status": status.strip(), "sourcePath": str(source), "sourceSha256": source_hash, "previousSourceSha256": post.get("sourceArtifactSha256"), "publicSlug": post.get("slug")})

    candidates.sort(key=lambda item: (item["date"], item["slug"]), reverse=True)
    selected = candidates[0] if candidates else None
    state = load_state()
    wake = bool(selected)
    reason = "candidate_ready" if selected else "corpus_aligned"
    signature = None
    if selected:
        signature = hashlib.sha256(json.dumps(selected, sort_keys=True).encode()).hexdigest()
        if state.get("signature") == signature and state.get("status") == "blocked":
            try:
                age = datetime.now(timezone.utc).timestamp() - datetime.fromisoformat(state["attemptedAt"].replace("Z", "+00:00")).timestamp()
            except (KeyError, TypeError, ValueError):
                age = BLOCK_COOLDOWN_SECONDS + 1
            if age < BLOCK_COOLDOWN_SECONDS:
                wake = False
                reason = "blocked_cooldown"

    git = subprocess.run(["git", "status", "--short"], cwd=BLOG, text=True, capture_output=True)
    packet = {
        "schemaVersion": 1,
        "wakeAgent": wake,
        "reason": reason,
        "candidateCount": len(candidates),
        "candidate": selected,
        "signature": signature,
        "statePath": str(STATE),
        "blogRepoDirty": bool(git.stdout.strip()) or git.returncode != 0,
        "blogRepoDirtyCount": len(git.stdout.splitlines()) if git.returncode == 0 else None,
        "brainIndexPath": str(index_path),
        "manifestPath": str(manifest_path),
    }
    print(json.dumps(packet, separators=(",", ":")))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
