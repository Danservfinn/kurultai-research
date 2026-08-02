# Kurultai Research

Public research site for reviewed Kurultai knowledge artifacts, served at [blog.kurult.ai](https://blog.kurult.ai).

The live corpus contains every canonical synthesized whitepaper listed in Brain's whitepaper index, plus the separately reviewed Yassa technical paper. Public editions preserve claims, evidence grades, limitations, falsifiers, and revision history while removing local filesystem coordinates and private session identifiers. The exact inventory and pre-publish decision are recorded in [`docs/PUBLICATION-INVENTORY-2026-08-02.md`](docs/PUBLICATION-INVENTORY-2026-08-02.md).

## Publication contract

The site never reads from the private Brain at request time. A post reaches production only when:

1. an exact source snapshot is explicitly allowlisted in `content/publication-manifest.json`;
2. its SHA-256 matches the frozen source digest;
3. the public-content validator rejects private paths, internal wikilinks, credential-shaped values, and private keys;
4. standing operator authorization covers canonical synthesized whitepapers, while semantic source/review/privacy gates still fail closed;
5. the build derives one accessible **neural knowledge-lineage SVG** from the paper’s frozen public source manifest or numbered references, renders sources as neuron nodes, preserves deterministic source-to-source lineage cues, and includes the asset in the build hash manifest;
6. publication fails closed if the graph is missing, unparseable, private-data-bearing, unmanifested, visually broken, or unavailable as anonymous `image/svg+xml`;
7. tests, typecheck, lint, static build, push, and anonymous public readback pass.

Dreamer is a discovery and synthesis layer—not unilateral publication authority. A six-hour wake gate detects newly canonical `published` whitepapers; the agent-backed publisher processes at most one candidate per run, runs the full source/privacy/review gate, publishes and verifies only a passing exact/public-redacted snapshot, and records blocked candidates without bypassing the gate. An independent script-only corpus guard continues to alert on missing papers or hash drift.

## Development

```bash
npm install
npm test
npm run typecheck
npm run lint
npm run build
npm start
```

The build emits static HTML, CSS, fonts, images, `robots.txt`, `sitemap.xml`, `llms.txt`, and a hash manifest under `dist/`. A minimal loopback-only Node server supplies security headers and a `/health` endpoint.

## Agent interface

Agents should start from the bounded index and fetch only changed Markdown records:

```bash
curl -fsSL https://blog.kurult.ai/api/v1/index.json | jq .
curl -fsSL https://blog.kurult.ai/research/<slug>/index.md
```

Published discovery and ingestion surfaces:

- `/llms.txt` — compact discovery and ingestion instructions
- `/llms-full.txt` — complete Markdown corpus in one request
- `/api/v1/index.json` — bounded metadata, provenance, URLs, and SHA-256 digests
- `/api/v1/index.schema.json` — JSON Schema for the discovery index
- `/api/v1/research/:slug.json` — self-contained typed article response
- `/api/v1/schema.json` — JSON Schema for item responses
- `/research/:slug/index.md` — exact frozen Markdown
- `/research/:slug/citation.json` — CSL-JSON citation metadata
- `/feed.json` — JSON Feed 1.1
- `/feed.xml` — Atom
- `/agents/` — copy-ready human/agent usage guide

## Architecture

```text
reviewed source snapshot
        |
allowlist + exact hash + privacy validator
        |
static React render
        |
loopback origin -> Cloudflare Tunnel -> blog.kurult.ai
```

No client JavaScript is shipped. The public origin has no Brain credentials, search access, mutation tools, forms, database, or operator session.
