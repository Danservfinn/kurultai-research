#!/usr/bin/env python3
"""Stay silent when every canonical published Brain whitepaper is on the blog."""
from __future__ import annotations

import hashlib
import json
import os
import re
from pathlib import Path

BRAIN = Path(os.environ.get("BRAIN_WHITEPAPERS_ROOT", "/Users/kublai/brain/whitepapers"))
BLOG = Path(os.environ.get("BLOG_REPO_ROOT", "/Users/kublai/blog.kurult.ai"))


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> int:
    index = (BRAIN / "index.md").read_text()
    manifest = json.loads((BLOG / "content/publication-manifest.json").read_text())
    posts: dict[str, dict] = {}
    for post in manifest["posts"]:
        posts[post["slug"]] = post
        canonical = post.get("canonicalSlug")
        if canonical:
            posts[canonical] = post
        for alias in post.get("aliases", []):
            posts[alias] = post
    canonical: list[tuple[str, str, str]] = []
    for date, title, slug, status in re.findall(
        r"^\|\s*(\d{4}-\d{2}-\d{2})\s*\|\s*(.*?)\s*\|\s*`([^`]+)`\s*\|\s*(.*?)\s*\|$",
        index,
        re.MULTILINE,
    ):
        if status.strip().lower().startswith("published"):
            canonical.append((slug, title, status.strip()))

    problems: list[str] = []
    for slug, title, status in canonical:
        source = BRAIN / f"{slug}.md"
        post = posts.get(slug)
        if not source.exists():
            problems.append(f"canonical source missing: {slug}")
            continue
        if post is None:
            problems.append(f"not published: {title} ({slug}; Brain status: {status})")
            continue
        expected_source = post.get("sourceArtifactSha256")
        if expected_source and sha256(source) != expected_source:
            problems.append(f"canonical source changed after public freeze: {slug}")
        public_snapshot = BLOG / "content/snapshots" / Path(post["sourceFile"]).name
        if not public_snapshot.exists():
            problems.append(f"public snapshot missing: {slug}")
        elif sha256(public_snapshot) != post.get("sourceSha256"):
            problems.append(f"public snapshot hash drift: {slug}")

    expected = {slug for slug, _, _ in canonical}
    tracked = {
        post.get("canonicalSlug") or post["slug"]
        for post in manifest["posts"]
        if post.get("sourceArtifactSha256")
    }
    stale = sorted(tracked - expected)
    if stale:
        problems.append("blog tracks whitepapers no longer canonical: " + ", ".join(stale))

    if problems:
        print("Kurultai Research whitepaper publication gate needs attention:\n- " + "\n- ".join(problems))
        print("No automatic publication occurred; run the source/privacy/review gate before updating the public manifest.")
        return 0
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
