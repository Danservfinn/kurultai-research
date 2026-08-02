# Public publication threat model

## Protected assets

- private Brain pages, indexes, sessions, and telemetry;
- credentials and operator identity data;
- mutable runtime and agent-control surfaces;
- unpublished or review-blocked content.

## Adversaries and failures

- a malicious or accidentally private source entering the public manifest;
- path traversal against the static origin;
- stale or edited source bytes published under an old review claim;
- browser injection through content or response headers;
- a public request reaching the private Brain or a mutation-capable service;
- DNS/tunnel misrouting to a different local service.

## Controls

- static copied snapshots only; no runtime mount or read path into Brain;
- explicit per-post allowlist and SHA-256 verification during build and request-independent tests;
- deny patterns for private paths, internal wikilinks, credential-shaped text, and private keys;
- loopback-only origin on a dedicated port and exact Cloudflare ingress hostname;
- no forms, cookies, analytics, database, client JavaScript, or Server Actions;
- restrictive CSP, frame denial, MIME sniffing denial, referrer and permissions policies;
- safe URL decoding and traversal rejection in the origin;
- exact public health and representative article readbacks after deployment.

## Residual risk

Automated pattern checks cannot prove that every sentence is appropriate for publication. Human exact-candidate review and explicit publication authorization remain required. Cloudflare and the Mac mini remain availability dependencies. A compromised local account could replace static files or the server; deployment receipts and source hashes make that detectable but do not prevent host compromise.
