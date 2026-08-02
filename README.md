# Kurultai Research

Public research site for reviewed Kurultai knowledge artifacts, served at [blog.kurult.ai](https://blog.kurult.ai).

## Publication contract

The site never reads from the private Brain at request time. A post reaches production only when:

1. an exact source snapshot is explicitly allowlisted in `content/publication-manifest.json`;
2. its SHA-256 matches the frozen source digest;
3. the public-content validator rejects private paths, internal wikilinks, credential-shaped values, and private keys;
4. a human has authorized publication;
5. tests, typecheck, lint, static build, and public readback pass.

Dreamer is a discovery and proposal layer—not publication authority.

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
