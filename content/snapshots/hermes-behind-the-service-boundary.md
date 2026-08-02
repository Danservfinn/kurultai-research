---
title: "Hermes Behind the Service Boundary: Trustworthy Customer-Facing Agents"
type: whitepaper
status: published
created: 2026-07-25
updated: 2026-07-25
sources: 18
tags: [hermes, kurultai, customer-facing-agents, trust, multi-tenant-saas, onboarding, retention, observability, assurance]
architecture_evidence_grade: B
customer_effect_evidence_grade: C
deployment_status: unimplemented
novelty: medium
review_rounds: 3
---
<!-- public-redacted-v3-zero-legacy-spelling; canonical-source-sha256: 215ac8e4795d8e1cd4abdbf2dbe6a56e2108ab0c1fef5e9aee077d90a38edbb2 -->

# Hermes Behind the Service Boundary: Trustworthy Customer-Facing Agents

## Revision log

**v1 → v2:** Round 1 found two CRITICAL defects and eleven lower-severity findings. The service invariant now includes tenant scope and purpose/consent; evidence confidence is split from unproven customer impact; the envelope is defined as an interface rather than a mandatory microservice; provider acceptance is separated from verified completion; approvals are risk-tiered; support access, deletion, telemetry bias, overhead, and threat controls are specified; source count and deterministic gate markers are corrected.

**v2 → v3:** Round 2 steelmanned the architecture but found two publication blockers: a superseded hot source and an unfalsifiable product-value gate. V3 pins the current candidate by hash and labels its `NO-GO` status, narrows the scope to consequential workflows, marks chat as context-only, pins the architecture capsule, and adds risk tiers, customer receipt examples, support operations, unit economics, and explicit product-value promotion gates.

**v3 → v4:** A late-arriving independent round-2 review invalidated the earlier publication decision. V4 resolves that review's two CRITICAL findings (aggregate evidence grading and undefined proof/receipt semantics) and addresses its major operational demands: it withdraws the aggregate B+ grade, defines a claim-shaped evidence ontology and receipt-validity contract, makes authority and support grants instantiable, adds deletion/retention and release-gate matrices, separates normative properties from the Hulegu reference profile, narrows Kurultai reuse claims, and adds architecture/economic ablations. V4 remains unimplemented and unpublished until its exact bytes receive independent review.

The smallest useful correction to the phrase “customer-facing Hermes agent” applies to **consequential, asynchronous, customer-data-bearing, tool-capable work**: **the customer should not meet a general operator agent with a new prompt; the customer should meet a narrow, proof-carrying service whose reasoning may be powered by Hermes behind a bounded interface.** The product surface must establish who is acting, which tenant owns the state, what authority exists, what evidence supports the result, and how the customer can correct, pause, export, delete, or escalate the work.

This conclusion is evidence-grounded but not yet customer-validated. Local live audits show that first-mile failures, missing support/legal surfaces, unsafe rate-limit assumptions, broken key generation, and gaps in trace correlation can invalidate an otherwise capable agent product. Reviewed local plans add a stronger design: deterministic ingress, pre-context safety, durable state machines, tenant fencing, explicit consent, bounded workers, receipts, outcome-linked feedback, and independent journey tests.

Evidence is deliberately split into lanes. The architectural proposal earns **B** confidence from correlated local audits, plans, and review passes; it does not have independent production validation. Dated readiness failures are **A-local observations** for their probe dates only. Mechanisms with contracts but no deployed customer path are **B-grade designs**. Trust, support-economics, retention, and revenue effects remain **C-grade hypotheses** until a real design-partner pilot measures them. This paper proposes a locally source-grounded, falsifiable design boundary. It does not prove implementation conformance, comparative superiority, customer trust, or customer benefit.

## Decision in one sentence

Use Hermes as a bounded reasoning or workflow substrate **behind** an Agent Service Envelope; do not expose a general Hermes profile as the product boundary until it can demonstrate tenant identity, capability limits, pre-context handling, durable recovery, claim-shaped evidence, and deletion behavior against the declared conformance suite.

### Prior-art and novelty boundary

This paper does **not** claim invention of authenticated identity, signed or capability-style grants, complete mediation, least privilege, zero-trust segmentation, idempotent state machines, audit logs, observability, privacy lifecycle controls, or red-team release gates. Its contribution is a local synthesis and review vocabulary: apply those established classes of mechanism to each customer-facing Hermes crossing; bind the resulting claim, grant, evidence, and recovery records into one inspectable contract; and require the simpler-system and receipt ablations in Gate G. The novelty claim is therefore medium and domain-specific. Comparative superiority remains unproven.

## Scope boundary

This paper is prescriptive for consequential workflows with customer data, asynchronous state, external tools, durable memory, or privileged effects. It is not a claim that every chatbot needs a separate service or every crossing needs an approval dialog. Low-risk informational assistants, internal single-tenant tools, and ephemeral demos may use a lighter boundary. The control strength should rise with authority, persistence, observability limits, and failure cost.

The tempting build is “make a customer profile, attach a Telegram bot, add tools, and improve the prompt.” The corpus points the other way. A customer-facing product is dominated by crossings that the model should not control:

```text
customer input
  -> identity + tenant resolution
  -> consent + admission
  -> deterministic normalization / pre-context screening
  -> capability and approval decision
  -> bounded Hermes or deterministic worker
  -> independently observed effect
  -> customer result + receipt
  -> correction / retry / support / delete
  -> tenant-owned eval and product-learning loop
```

The decision-changing synthesis is the **proof-carrying service envelope**. Every consequential crossing carries a typed context:

```text
crossing = principal
         × tenant_scope
         × purpose_and_consent
         × authority
         × evidence
         × recovery
```

If any term is absent, the system has trust debt even when the model answer looks good. The context must survive queues, retries, support access, and publication; it cannot be reconstructed later from customer text or model prose. “Proof-carrying” does not mean exposing chain-of-thought or every internal trace. It means carrying typed evidence references and an honest result state across the boundary.

The envelope is an interface invariant, not a command to create a microservice. A hardened Hermes runtime may serve the customer directly if it can prove the same ingress, tenancy, authority, evidence, and recovery properties. The local Hulegu plan rejected the existing generic Telegram adapter for its specific Parse-before-context contract; that is strong product-specific design evidence, not proof that every general Hermes profile is inherently unsafe. The named primitive was not found in the searched Brain corpus and is synthesized from the local trust-boundary, typed-evidence, tenant-isolation, receipt, outcome-telemetry, and restartable-loop work. This is a **corpus-local novelty claim**, not an assertion of novelty against the external systems or security literature.

## Corpus and evidence method

The corpus combines Brain artifacts with chat decision history. Artifacts are authoritative only for their stated scope; chat records are **context-only provenance** used to recover operator intent and review history, not graded evidence for architecture or current runtime claims. Current-state architecture capsules are L1 caches and must be checked against canonical sources before implementation. Plans are evidence of reviewed design, not evidence that the design is deployed.

Evidence grades used here:

| Grade | Meaning in this paper |
|---|---|
| **A-local** | Direct local probe, inspected artifact, executed test, or explicit operator decision with a receiptable source. Time-bounded; not automatically current forever. |
| **B** | Plausible and locally source-grounded architecture or design. Sources may be correlated; implementation conformance and comparative superiority are unproven. |
| **C** | Product or market hypothesis that requires customer evidence. |

### Source manifest

| ID | Source | Kind | Grade | Used for |
|---|---|---|---:|---|
| S1 | `brain/status/kurultai-living-architecture-capsule.md` at SHA-256 `c282af30ff8e1a03fd8d2eef215a031caf9dec61db34e0e613c11f5c5924d84e`, generated `2026-07-21T16:28:44Z` | L1 current-state cache | B cache | Existing Brain, Buildroom, Kanban, traceability, approval, and proof-debt surfaces. It is routing context, not live runtime proof. |
| S2 | `brain/analyses/2026-05-02-parse-agents-paid-user-readiness.md` | Live/read-only readiness audit | A-local | Hosted health versus paid-self-service gaps: legal, security, support, onboarding, and dependency risk. |
| S3 | `brain/docs/plans/2026-06-01-parse-complete-dogfood-repair-plan.md` | Probe-backed repair plan | A-local/B | First-mile `503` failures, unsafe or misleading surface behavior, and end-to-end repair requirements. |
| S4 | `brain/docs/plans/2026-06-01-parse-agent-trust-boundary-sprint.md` | Product/offer plan | B | Untrusted customer text must be separated from tool, account, refund, support, and privileged actions. |
| S5 | `brain/docs/plans/parse-outcome-linked-telemetry-implementation-plan.md` | Superseded/deferred design | B | Original outcome-telemetry data flow and the need to distinguish technical and task outcomes. |
| S6 | `brain/docs/plans/parse-outcome-linked-telemetry-task-0-revised-contract.md` | Revised specification | B design | Internal-only enrollment, immutable release semantics, attempt-based denominators, consent, receipt transport, retention, and minimization. No runtime authorization. |
| S7 | `brain/analyses/2026-07-20-parse-outcome-linked-telemetry-implementation-plan-critical-review.md` | Critical review | A-local/B | Privacy differencing, denominator bias, consent, retention, transport, branch-eligibility, and dirty-worktree blockers. |
| S8 | `brain/analyses/2026-07-20-parse-outcome-linked-telemetry-critical-review-independent-validation.md` | Independent validation | A-local | Executed privacy, denominator, CORS, repo-state, typecheck, and observer-test probes that upheld the defer decision. |
| S9 | `brain/analyses/2026-05-18-agent-e2e-testing-skill-design-memo.md` | Design memo | B | Safe journey testing, tiered targets, evidence packets, and explicit no-danger boundaries. |
| S10 | `brain/analyses/2026-05-18-hermes-openclaw-observability-design-memo.md` | Inventory/design memo | B | Partial receipt/trace inventory and explicit gaps in correlation, LLM-specific spans, and cost attribution. |
| S11 | `brain/docs/plans/parse-improvement-loop-design.md` | Control-loop design | B design | File-backed restartability, proposal-first changes, independent verification, first-mile canaries, and accepted-change economics. |
| S12 | `brain/docs/plans/2026-07-25-kublai-hulegu-job-search-agent-implementation-plan-v3.md` at SHA-256 `07e885de133fc742d33b8a2f8bae25ce25d1d0da5c5efbbaf0d56f38bb3a0ac9` | Superseding planning candidate; current verdict `NO-GO` pending exact-hash review | B design | Dedicated customer service, deterministic state machine, consent, tenant isolation, bounded workers, durable outbox, pause/cancel/delete fencing, and exact acceptance journey. It is not an approved implementation contract and is not implemented. |
| S13 | `brain/analyses/2026-07-13-satya-nadella-reverse-information-paradox.md` | Primary-source study synthesis | B | Tenant-owned learning exhaust, model-swappable local evals, and provider-boundary risk. |
| S14 | `brain/analyses/2026-06-17-ai-agent-moat-harness-data-flywheels.md` | Public-source analysis | B | Outcome-labeled trajectories and corrections as the durable asset rather than harness novelty alone. |
| C1 | Hermes session `[private session reference withheld]` | Context-only operator decision history | Not graded | Proposal-only SaaS readiness route; first-mile, support, legal, and admin intent. |
| C2 | Hermes session `20260721_010341_3a5072` | Context-only review history | Not graded | Outcome-telemetry review chronology; artifact claims are anchored to S6–S8. |
| C3 | Hermes session `20260724_113023_a84419` | Context-only product-design history | Not graded | Machine-first resolver and tenant-owned-learning intent; artifact claims are anchored where available. |
| C4 | Hermes session `20260725_023435_c2f08d` | Context-only product-design/review history | Not graded | Dedicated-service design history; current canonical candidate is pinned as S12. |

### Source freeze and independence note

The artifact manifest was frozen on `2026-07-25` by content hash. The “Used for” column and claim ledger provide the cited locus; the hash, not mutable line numbering, defines the reviewed bytes.

| ID | SHA-256 | Snapshot/review status |
|---|---|---|
| S1 | `c282af30ff8e1a03fd8d2eef215a031caf9dec61db34e0e613c11f5c5924d84e` | Generated `2026-07-21T16:28:44Z`; L1 cache only. |
| S2 | `3b5eb41270044be02c853888fc202bb895662bf24bde3c7bd4e4ca72b128d8ae` | Frozen 2026-07-25; dated local audit. |
| S3 | `1dac24b704a2998720d50861a5f0d36e908cfbc273bb73cf2c6169fefdfb8f07` | Frozen 2026-07-25; probe-backed plan. |
| S4 | `e6f691375ffd928b15f776f27c4027b5524b0cbabd5f5e947ca5a9e362b93529` | Frozen 2026-07-25; design plan. |
| S5 | `623adc2eb314696b26fc343dcbf92f20e77e4be8835b6d8aadfdecb0b34da7de` | Frozen 2026-07-25; superseded/deferred design. |
| S6 | `e02ab6eb80b2bf6a5ec8e06342cf2c870f186c17d869242088fb92684bffac82` | Frozen 2026-07-25; revised specification, not runtime proof. |
| S7 | `eddaf47229008e7560ba149f74c411d4dfd0157190c97c707d386e3bcf175f79` | Frozen 2026-07-25; critical review. |
| S8 | `d5501d81947de5a7626b6b084d44daf7a8920735d298708e134413f4391e0b69` | Frozen 2026-07-25; independent local validation. |
| S9 | `e7f45707652289d7b46a4de86b0fdbb7a8482b76185cdcead9ed151ccce27b7e` | Frozen 2026-07-25; design memo. |
| S10 | `330f8fa69e997cfe013240eca281558fa25d2d5e40c4aa9ded9072a5c78c6f59` | Frozen 2026-07-25; inventory/design memo. |
| S11 | `349708481a46e1e036d0a62058ed820f30d1638519618f4643cc93699119dc26` | Frozen 2026-07-25; control-loop design. |
| S12 | `07e885de133fc742d33b8a2f8bae25ce25d1d0da5c5efbbaf0d56f38bb3a0ac9` | Frozen 2026-07-25; author-reconciled planning candidate, `NO-GO`, not independently approved at this hash. C4 is the same lineage and is not counted as independent support. |
| S13 | `3eefedd76a87882dd69071f976aca839f74c6a9dc9c6b4d5c7b5002ef491075c` | Frozen 2026-07-25; public-source study synthesis. |
| S14 | `d6e7bb7a11225de32f8c513eb2e6f91458f61ab05a0bf03c1b3a399d1ed8a6e8` | Frozen 2026-07-25; public-source analysis. |

C1–C4 are context-only session provenance. They are identified by immutable session IDs in this local session store, are not graded evidence, and are not counted as independent convergence. “Independent” in this paper means a separate reviewer who did not author the candidate bytes and who evaluates a pinned artifact without relying on its runtime or evidence producer; organizational independence is not claimed.

## Claim ledger: five convergent themes

| Theme | Candidate claim | Evidence type | Grade | What is not proven |
|---|---|---|---:|---|
| 1. Narrow service envelope | A prompt-only profile is too broad a default boundary for consequential customer workflows; require an admitted ingress and bounded worker interface, whether implemented in Hermes or beside it. | S4, S10, S12 | **B architecture; S12 itself B** | No comparative production test between a hardened general profile and a dedicated service. |
| 2. Calibrated assurance plus recovery | Typed receipts can support assurance only when tied to an explicit claim, observation method, uncertainty, understandable result state, support, retry, correction, and exit paths. | S2, S3, S9–S12 | **B architecture; C customer effect** | No measured causal effect on renewal, support load, perceived risk, or willingness to pay. |
| 3. Tenancy is authority, not a column | Tenant identity should come from authenticated transport/session assertions and be enforced across rows, files, workers, publications, logs, backups, and deletion. | S7, S8, S12, S13 | **B design** | The reviewed tenant contract is not implemented or penetration-tested. |
| 4. Learning requires outcome semantics and consent | Technical status, task outcome, correctness, and downstream business outcome should remain distinct; customer feedback should become tenant-owned eval signal, not hidden cross-tenant memory. | S5–S8, S11, S13, S14 | **B design; C product effect** | Self-reported outcomes can be biased; no evidence yet links the proposed signals to retention. |
| 5. Readiness is an end-to-end journey | Product readiness should be tested through the customer’s full first-mile and recovery journey, not component tests or model quality alone. | S2, S3, S9, S11, S12 | **A-local for failure examples; B for generalization** | No complete customer-facing Hermes journey has passed all proposed gates. |

## Theme 1 — Put Hermes behind a narrow product boundary

Hermes is valuable as a reasoning, tool-routing, and workflow substrate. That does not make a prompt-only general chat surface the right default product boundary. The local Hulegu review reached a concrete product-specific decision: customer documents should be accepted by one dedicated Telegram service, normalized and parsed outside model context, moved through a durable state machine, and handed to bounded workers. The existing generic adapter was rejected for that V1 because its attachment/text path did not satisfy the product's stronger Parse-before-context contract and because the general agent enlarged the tool and identity surface (S12). This is not evidence that a hardened Hermes runtime could never implement the envelope internally.

The transferable rule is narrower: the customer surface should be a small protocol, not merely a persona:

1. Resolve principal and tenant from trusted transport or session metadata.
2. Admit only allowlisted input types, sizes, states, and consent versions.
3. Normalize, quarantine, and screen untrusted content before it can influence a model or tool.
4. Compile an explicit capability manifest for this request.
5. Invoke Hermes only with sanitized, tenant-scoped context and bounded tools, or use a deterministic worker when reasoning is unnecessary.
6. Observe the effect independently and emit a customer result plus operator receipt.

A minimum conforming envelope binds identity, authority, execution, and evidence without collapsing them into one status:

```json
{
  "principal": {
    "subject_ref": "opaque authenticated subject",
    "tenant_ref": "server-resolved tenant",
    "issuer": "trusted identity broker",
    "audience": "this service",
    "auth_event_ref": "session or challenge",
    "authenticated_at": "RFC3339"
  },
  "purpose": {
    "purpose_ref": "versioned use purpose",
    "consent_version": "v1",
    "input_class": "allowlisted enum",
    "intent_digest": "sha256:..."
  },
  "authority_grant": {
    "grant_ref": "opaque id",
    "issuer": "policy service",
    "audience": "bounded worker",
    "capabilities": ["read:catalog", "propose:answer"],
    "resource_constraints": {"tenant_ref": "...", "destination_ref": "..."},
    "policy_version": "...",
    "issued_at": "RFC3339",
    "expires_at": "RFC3339",
    "nonce": "single-use nonce",
    "use_limit": 1,
    "revocation_epoch": 7,
    "approval_ref": null
  },
  "execution": {
    "run_ref": "run id",
    "attempt_ref": "attempt id",
    "state": "admitted|queued|running|provider_accepted|effect_observed|unresolved|failed|cancelled",
    "state_version": 4
  },
  "effect_claim": {
    "claim_type": "versioned enum",
    "subject_ref": "what supposedly acted",
    "object_ref": "what supposedly changed",
    "expected_digest": "sha256:..."
  },
  "evidence": [{
    "producer_ref": "provider|runtime|independent-reader|oracle",
    "observation_method": "versioned method",
    "observed_at": "RFC3339",
    "scope": "claim fields covered",
    "artifact_digest": "sha256:...",
    "verifier_version": "...",
    "fresh_until": "RFC3339|null",
    "independence": "same-runtime|separate-reader|external-oracle",
    "revoked_at": null,
    "residual_uncertainty": "explicit text or enum"
  }],
  "outcome_report": {
    "state": "unknown|customer_reported|system_observed|oracle_adjudicated",
    "reporter_ref": null,
    "observed_at": null
  },
  "recovery": ["retry", "correct", "support", "export", "delete"]
}
```

The concrete serialization is illustrative; the semantic fields are normative. Provider acceptance is an execution observation, not effect proof. A customer report, independent readback, and oracle adjudication are distinct evidence records and do not form a universal monotonic ladder.

### Conformance invariant and Hulegu reference profile

A design conforms only if these implementation-neutral properties hold:

1. the model cannot originate or widen principal, tenant, purpose, consent, authority, destination, or approval;
2. grants are issuer/audience/resource/intent-bound, expiring, replay-limited, revocable, and rechecked before asynchronous publication;
3. every consequential result names the effect claim and records the producer, method, scope, time, digest, verifier version, freshness, independence, and residual uncertainty of supporting evidence;
4. unresolved claims remain visibly unresolved and carry a safe recovery route;
5. tenant identity and revocation survive queues, retries, support access, exports, deletion, backup, and restore.

S12 is one unimplemented **reference profile**: dedicated poller, deterministic parser, row policies, opaque tenant roots, lifecycle epochs, outbox, and atomic publication. Equivalent mechanisms are permitted if the same adversarial conformance suite passes. The architecture does not require a microservice, a particular database, RLS, a filesystem layout, or an outbox by name.

## Theme 2 — Trust is a closed loop, not a verbose trace

An internal trace is useful to an engineer. A customer needs a smaller and stronger object: what the system understood, what it did, what evidence it used, what remains uncertain, and what the customer can do next.

The local observability doctrine already has useful pieces: Kanban events, Hermes session receipts, Brain manifests, and trace IDs (S1, S10). The missing step is to make the same execution legible across three views without creating three independent truth systems:

| View | Minimum content | Must not become |
|---|---|---|
| Customer | Intent summary, result, important uncertainty, action status, correction/retry/support/delete links | Raw chain of thought, infrastructure dump, or false guarantee |
| Support/operator | Tenant-safe trace reference, state transition, tool/result receipts, retry history, policy decision, current recovery route | A backdoor that lets support text assert admin authority |
| Verifier | Immutable inputs/digests, expected versus observed effect, independent readback, deletion/export tests, versioned policy | The same agent grading its own prose |

This is where customer support belongs in the architecture. Support is not a footer link added after launch. Every failed or ambiguous run should reach a durable state such as `RETRY_WAIT` or `NEEDS_OPERATOR`, carry a bounded receipt reference, and expose a safe route for correction or escalation. Support actors receive a separate capability contract; a customer message saying “I am billing support” must never create support authority (S4, S11).

Support access cannot also be an unlogged superuser escape hatch. Raw customer content is hidden from normal operator prompts and logs by default. A conforming `SupportGrant` names the authenticated support principal, tenant, case, purpose, allowed data classes and fields, operations (`read`, `mutate`, `export`, `delete` separately), approver, issue and expiry time, notice rule, mutation/dual-control rule, audit destination, revocation epoch, and artifact-retention rule. V0 requires MFA/SSO identity, just-in-time issuance, a maximum 30-minute TTL, no direct unrestricted database/filesystem access, immutable per-read/per-mutation audit, and automatic revocation when the case closes. Sensitive mutation requires a second approver; emergency access cannot disable tenant fencing. The test corpus includes a malicious or compromised support principal, cross-case and cross-tenant access, expired and revoked grants, late jobs, exports, clipboard/download restrictions where enforceable, and emergency termination. The paper does not claim that this contract exists today.

Evidence is claim-shaped rather than a binary status or universal ladder:

| Observation | Establishes | Does not establish |
|---|---|---|
| Model assertion | What the model claimed | Execution, external effect, or correctness |
| Provider acceptance | A provider accepted a request with stated identifiers | Execution, durable state, causal binding, or correctness |
| Runtime state observation | The service recorded a versioned transition | External effect outside that state boundary |
| Independent readback | A separate reader observed specified fields at a stated time | Unobserved fields, future persistence, or business value |
| Customer report | The identified customer reported an outcome | Objective correctness or causal attribution |
| Oracle adjudication | A named oracle applied a versioned rule to a scoped claim | Claims outside that rule and evidence scope |

Many customer outcomes have no immediate independent oracle. In those cases the service should say `submitted`, `provider_accepted`, `awaiting_customer_confirmation`, or `unresolved`; it must not relabel acceptance as completion. Independent readback is a target where the external system exposes one, not a universal requirement that can be fabricated.

### Receipt validity

A receipt is a signed or integrity-protected assertion container, not proof merely because it exists. Its validity is bounded by:

- **binding:** principal, tenant, purpose, grant, intent, run/attempt, effect claim, policy version, and evidence digests are linked;
- **completeness scope:** it names the fields and interval covered and lists omitted or unavailable evidence;
- **integrity/authenticity:** producer identity, canonical encoding, digest/signature scheme, key/policy version, and verification result are recorded;
- **independence:** each observation states whether it came from the acting runtime, a separate reader, the customer, or an external oracle;
- **freshness and replay:** timestamps, expiry, nonce/use counter, supersession, and duplicate-delivery behavior are explicit;
- **retention and revocation:** retention class, redaction policy, deletion/tombstone behavior, key compromise, policy rollback, and revoked evidence are handled without silently upgrading confidence;
- **proof debt:** missing coverage or failed verification yields `unresolved` plus recovery, never a fabricated green state.

Customer receipts expose only the minimum safe projection. Operator and verifier packets may be richer, but no view may omit uncertainty while preserving a success label.

Trust therefore has a recovery invariant:

```text
no consequential action is complete until
expected effect == independently observed effect
or an approved outcome oracle adjudicates it
or the run is visibly unresolved with a safe recovery route
```

## Theme 3 — Multi-tenancy is a distributed authority property

A `tenant_id` column is bookkeeping. Tenant isolation is a property of every state transition and storage boundary.

The most detailed local design candidate (S12) requires tenant identity to be derived from a pinned bot identity and authenticated private-chat actor, then carried as a trusted principal rather than a model-supplied UUID. It extends isolation through row-level policies, composite tenant foreign keys, scoped uniqueness, tenant-specific filesystem roots, job leases, lifecycle/work epochs, publication generations, outbox rows, exports, receipts, backups, deletion, and restore tombstones. The plan remains `NO-GO` pending exact-hash review and is not implementation evidence.

For customer-facing Hermes services, the minimum tenant contract is:

- **Identity:** derive tenant from authenticated transport/session state; never from free text or tool arguments generated by a model. Provisioning, role changes, and offboarding must revoke future access and stale asynchronous authority.
- **Authority:** pass a typed principal/capability object to repositories and tools; use both read and write policies; recheck authority at asynchronous completion and publication time.
- **Storage:** fence database rows, filesystem paths, object keys, caches, logs, receipts, exports, temporary files, region placement, and provider subprocess metadata. Treat support and analytics as separate scopes, not privileged exceptions.
- **Lifecycle:** pause, cancel, consent withdrawal, and deletion must revoke late workers. Backups need bounded erasure behavior and restore-time tombstones. Residency, legal hold, and key-management policy remain explicit proof debt, not implied features.

The practical sequence matters. Begin with one design partner and one dedicated deployment if necessary, while designing identifiers, receipts, exports, and deletion paths so they do not become global ambient state. A dedicated deployment reduces shared-runtime crossings but is not itself proof of isolation: support consoles, analytics, backups, provider metadata, and operator tooling can still cross tenants. Backup erasure also cannot be promised as instantaneous unless the storage system proves it; the contract should state the bounded deletion window, cryptographic-erasure strategy where used, and restore-time tombstone behavior.

True shared multi-tenant rollout is gated until seeded cross-tenant read/write/file/receipt/export tests, support-scope tests, stale-worker tests, backup/restore drills, and incident-recovery tests pass with zero leakage. These are acceptance targets, not descriptions of current implementation.

### Deletion and retention matrix

Deletion is an asynchronous protocol with explicit owners and verification; a `deleted_at` column is not completion. Product policy must instantiate this matrix before collecting customer data:

| Surface | Owner and tenant scope | Retention/erasure semantics | Restore/processor obligation | Verification artifact |
|---|---|---|---|---|
| Primary rows | Data service; mandatory tenant predicate | Tombstone immediately; physical purge within policy SLO | Restore replays tombstones before serving reads | Row/policy negative reads plus purge receipt |
| Files/object storage | Storage service; opaque tenant prefix and object ACL | Revoke access immediately; object/version purge by SLO | Inventory restored versions; reapply tombstones | Version listing and digest-based absence check |
| Cache/vector/search index | Owning service; tenant-keyed namespace | Invalidate synchronously, rebuild without deleted object | Restores cannot repopulate from stale source | Cross-tenant/late-population fixture |
| Queue/outbox/worker scratch | Workflow service; tenant and lifecycle epoch on every item | Cancel or poison pending work; bounded scratch TTL | Worker rechecks deletion/revocation epoch before effects/publication | Late-worker and duplicate-delivery drill |
| Exports/downloads | Export service; tenant/user grant | Short expiry, revocable link, customer warned about downloaded copies | No silent regeneration after restore | Expired/revoked-link tests and export ledger |
| Receipts/audit/security logs | Assurance owner; tenant-scoped redacted reference | Retain only minimum legal/security fields; cryptographic tombstone or key erasure where full deletion conflicts with audit duty | Document legal basis and avoid recoverable raw payload | Policy decision plus redaction/key-erasure verification |
| Backups/replicas/analytics | Infrastructure/data owner; environment and tenant inventory | Quarantine until expiry or cryptographic erasure; no active serving | Restore pipeline replays deletion ledger before release | Restore drill, age report, and second-party review |
| Support artifacts/vendor subprocessors | Support/privacy owner; case and tenant bound | Case-close purge by class; revoke grants and vendor copies | Contracted deletion/attestation and incident route | SupportGrant audit and processor attestation |

Deletion receipts name surfaces attempted, per-surface status, outstanding legal/backup exceptions, next verification time, and accountable owner. New storage surfaces fail closed until added to this inventory. Cross-region data routing, residency, encryption/key ownership, vendor subprocessors, and legal holds are tenant policy inputs rather than after-launch documentation.

Before G2, the operator must record controller/processor roles, data classes, residency, subprocessor list and transfer basis, DPA/consent terms, privacy-impact review, encryption/key ownership and rotation, access-log retention, incident/breach-notice route, and verified erasure/restore procedure. Missing policy is a gate failure, not an implementation detail. The design-partner packet must also name the budget owner, tenant authority owner, workflow owner, support owner, security/privacy contacts, service hours, acknowledgement/restore targets, exclusions, exit/export route, and kill authority. Security review, procurement, and contractual acceptance are part of the product journey.

## Theme 4 — Repeatable-value and tenant-learning hypothesis

Customer retention is not observed. The hypothesis is that a customer may stay if the service repeatedly produces useful outcomes with low risk and low recovery cost; model eloquence is at most an input.

The corpus converges on a four-level outcome model:

| Level | Example | Who can establish it? |
|---|---|---|
| Technical status | Request returned `200`; tool call finished | Runtime receipt |
| Task outcome | Customer reports the result was useful or not useful | Customer, possibly corrected later |
| Correctness | Output or action matches a domain oracle | Independent verifier or adjudicated review |
| Business outcome | Ticket resolved, candidate interviewed, workflow time reduced, renewal occurred | Downstream system or explicit customer evidence |

These must not be collapsed. A successful request is not a successful customer task. A reported task success is not proof that a security verdict was correct. A high report-linkage rate is not a retention metric. The telemetry review demonstrated how apparently reasonable aggregates can leak sparse outcomes, hide failed writes in the denominator, retain data without an enforced service, and expose receipts unsafely (S7, S8).

The smallest safe learning loop is tenant-owned and explicit:

```text
customer task
  -> bounded execution trajectory
  -> accept / reject / edit / escalate / outcome
  -> tenant-local fixture or preference update
  -> independent rerun
  -> versioned change receipt
```

This preserves the scarce asset identified in S13 and S14—the loop that converts corrections and outcomes into reusable capability—without silently pooling private customer exhaust. Cross-tenant aggregation or training is gated behind an approved consent, minimization, privacy-release, retention, and deletion contract. The system should prefer closed, low-cardinality signals and explicit edits over free-form hidden memory.

A pilot should measure, not assume:

- time to first independently verified value where a verifier exists, otherwise time to an honestly labeled terminal state;
- fraction of runs with complete typed crossing contexts and evidence receipts;
- correction, retry, escalation, and abandonment rates;
- support time to diagnose and safely recover;
- deletion/export journey success;
- customer-reported value and, later, observed renewal or expansion.

These signals are observational and easy to bias. Customers who report outcomes may differ from those who disappear; better support may increase reporting while making a metric look worse; retries can reflect either recovery or poor quality. The pilot should freeze event semantics, preserve denominators, track missingness, compare cohorts only when enrollment is explicit, and label causal claims as hypotheses. A model-swap replay on held-out tenant-local fixtures can test whether the surrounding harness retains value when the model changes, but it cannot prove customer retention.

Only the last category can directly test the retention thesis, and even then correlation is not causation without a credible comparison.

## Theme 5 — Product readiness is the customer journey plus continuous assurance

The Parse audits are a useful warning. A hosted health endpoint can be green while key generation, authenticated use, legal pages, dependency security, rate limiting, support, or the clean-buyer journey is broken (S2, S3). Component tests and model evals are necessary but insufficient.

The smallest release gate is one synthetic customer journey that exercises the actual state machine:

```text
start
-> consent / decline
-> submit bounded input
-> durable acknowledgement
-> review and correct extracted intent
-> authorize a bounded run
-> receive status and result
-> verify the external effect or artifact
-> retry / pause / cancel
-> contact support with a receipt reference
-> export
-> delete
-> prove late workers and restores cannot resurrect state
```

Run it after meaningful changes and on an approved cadence. Use synthetic data and safe accounts. The E2E agent may navigate and collect evidence, but it must not handle real customer credentials, disable protections, make payments, or invent a green result (S9). Failures should enter existing implementation/incidents/proof-debt routes in Buildroom/Kanban; customer jobs themselves remain product-domain state, not one Kanban card per message (S1, S12).

Approval should be risk-tiered rather than universal friction. The V0 policy is explicit:

| Tier | Example | Approver and authorization object | Expiry/revocation | Evidence, verifier, rollback |
|---|---|---|---|---|
| T0 — inspect | Read public or tenant-authorized data | Tenant admin issues a standing `ReadGrant` bound to principal, tenant, resource class, purpose, policy version, and audience | Short-lived session grant; revoke on membership/policy epoch change | Policy-engine decision plus source provenance; no external effect to roll back |
| T1 — draft | Produce a reversible draft or internal suggestion | Tenant admin policy issues `DraftGrant`; customer remains able to edit/reject | Expires with session or input/policy change | Input digest, model/tool version, artifact receipt; verifier checks no external send/mutation |
| T2 — bounded external effect | Send or mutate something reversible and already in scope | Identified customer or delegated approver issues single-use `EffectGrant` bound to principal, tenant, operation, object, destination/provider account, exact intent digest, and preview | Minutes, one use; revoke/cancel before commit; duplicate deliveries consume no extra authority | Provider receipt plus separate readback where available; compensating action or explicit unresolved recovery |
| T3 — high consequence | Disclose sensitive data, delete durable state, change permissions | Fresh step-up by authorized tenant role; sensitive mutation may require dual control and delay window | Very short TTL; cancel token, revocation epoch, and worker recheck immediately before effect | Independent verifier or explicit unresolved state; rollback/restore policy, security escalation, and customer notice |
| T4 — prohibited in V0 | Payments, credentials, legal commitments, employer/customer outreach outside the single approved workflow | Versioned deny policy; no grant type exists | Not applicable; request is refused and auditable | No execution; safe escalation only |

The policy engine derives tier from operation, resource, data class, destination, reversibility, tenant policy, and current lifecycle state; the model may suggest but cannot choose or downgrade the tier. Every asynchronous worker revalidates grant audience, intent/destination binding, expiry, use counter, approval, and revocation epoch before the effect and again before publication.

The improvement loop then stays small and restartable (S11): observe one failure family, propose at most one bounded change, verify against golden and holdout journeys, record accepted/rejected/no-op outcomes, and stop at the approval boundary. The supervision metric is not patches generated. It is accepted improvements per review minute without false greens, leakage, or regressions.

## Smallest credible product slice

Do not begin with a generic “AI employee” or shared multi-tenant platform. Begin with one design partner, one workflow, one channel, and one reversible authority class.

The initial ICP is not “anyone who wants an agent.” It is a small team with one repeated, consequential but bounded workflow, an identifiable administrator, auditable source systems, and enough task frequency to measure rescue cost. The buyer approves policy and budget; the tenant administrator provisions users and reviews access; the end user submits and corrects work; support handles scoped recovery. One person may hold several roles in V0, but the authority objects stay distinct.

The product promise is narrow: produce one inspectable result artifact or honestly labeled unresolved state faster and more safely than the customer’s current process. Packaging, pricing, channel expansion, SSO/SCIM, data-residency options, and self-service multi-tenancy remain product proof debt until the first workflow clears the pilot gates.

Recommended first slice:

| Dimension | V0 choice |
|---|---|
| Customer | One approved design partner or owned synthetic customer |
| Workflow | One narrow, frequent, inspectable job with a clear result artifact |
| Authority | Read-only or proposal-only; no payments, account mutation, employer/customer sends, or irreversible actions |
| Surface | Dedicated bot or web service with one authoritative ingress owner |
| Hermes role | Sanitized reasoning/workflow worker behind a capability manifest; deterministic code for identity, consent, state, publication, and deletion |
| Data | Dedicated tenant root and database scope; no raw customer content in Brain, Git, normal logs, or operator prompts by default; exceptional support access follows the scoped audit contract |
| Learning | Explicit accept/reject/edit/outcome events; tenant-local fixtures; no online training |
| Assurance | Synthetic end-to-end journey, cross-tenant adversarial fixtures, calibrated evidence status, restart/deletion drills |
| Support | Receipt-addressed retry/correction/escalation path with separate support authority |

A customer receipt should be small and honest. For example:

```text
SUBMITTED
Provider accepted request req_7f3 at 10:42 UTC.
Not yet proven: the external effect.
Next: wait for readback, cancel, or contact support with case ref run_91a.

VERIFIED
External readback at 10:43 UTC matched the approved intent digest.
Evidence: effect_ref sha256:…

UNRESOLVED
The provider accepted the request, but no readback is available.
No completion claim was made. Retry or open a scoped support case.
```

Internal traces may contain richer operational detail; customer receipts expose the claim, execution state, evidence type/confidence/residual uncertainty, safe next step, and references without chain-of-thought, secrets, or unrelated tenant data.

The V0 support contract is also executable:

| Support event | Pilot rule |
|---|---|
| Ordinary failure | Acknowledge within one business day; link the case to the run receipt; never ask the customer to resend secrets. |
| Suspected tenant/privacy breach | Stop affected processing immediately, preserve redacted evidence, and escalate to the owner/security route; no autonomous resume. |
| Scoped diagnosis | Use a ≤30-minute case grant with field-level access, read audit, auto-revocation, and customer/admin notice when permitted. |
| Recovery | Record retry/correct/refund-or-credit/escalate outcome and whether the original artifact was superseded. |
| Closure | Customer-visible resolution plus an implementation incident/proof-debt row if the failure is systemic; the customer job itself remains product state. |

This slice can fail usefully. If customers do not value the workflow, the system has not accumulated a huge multi-tenant platform. If they do, the receipts, fixtures, outcome vocabulary, and tenant boundaries are already shaped for expansion.

The cost is real. A narrow ingress, durable state machine, independent evidence, support controls, isolation drills, and deletion semantics add engineering and review load. A dedicated deployment can add operating cost; customer-visible receipts can add interface complexity; explicit approvals can add latency. The envelope is justified only if it lowers incident risk or recovery cost, improves first verified value, or enables customer jobs that would otherwise be too risky. Those benefits are hypotheses for the pilot, not free consequences of more infrastructure.

Track the full variable cost per successful result:

```text
variable_cost = model/provider + verification + storage/retention
              + support_labor + incident/recovery allocation
contribution_margin = realized_price - variable_cost
```

Tokens alone are not unit economics. A workflow that looks cheap until a human rescues every third run is not ready to scale.

## Minimum threat map

| Threat | Boundary control | Required proof before customer use |
|---|---|---|
| Forged/stale identity or session, membership drift | Verify issuer/audience/signature/freshness; server-resolve tenant and role; step-up for sensitive actions; offboarding/revocation epochs | Spoofed/replayed token, fixation, CSRF, membership-change, offboarding, recovery, and clock-skew fixtures |
| Prompt injection or malicious attachment | Deterministic normalization, quarantine, pre-context screening, bounded capability manifest | Hostile/safe polyglot, archive-bomb, Unicode/MIME mismatch, and no-raw-bypass fixtures |
| Parser/ingestion disagreement or malware | One authoritative ingestion owner, content sniffing, size/ratio limits, sandboxed conversion, canonical digest, AV/CDR policy | Parser differential tests, decompression limits, malformed document corpus, quarantine/appeal receipt |
| Confused deputy or text-asserted authority | Transport-derived principal, typed grants, policy tiering, exact intent/destination binding | Negative authorization, stale/duplicate approval, destination-swap, replay, and downgraded-tier tests |
| Database policy bypass or privileged migration | Tenant predicates/RLS or equivalent complete mediation, least-privilege roles, migration review, no app superuser | Direct-query and alternate-code-path tests; admin/migration audit; fail-closed policy tests |
| Filesystem/object/cache namespace escape | Opaque tenant roots, safe path APIs, no symlink following, tenant-keyed cache/index, object ACL | Traversal/symlink/hardlink, stale cache, object-version, archive extraction, and cross-tenant fixtures |
| Worker/provider/log exfiltration | Minimized tenant-scoped context, provider allowlist/DPA, egress controls, secret isolation, redacted structured logs | Prompt/tool exfiltration, provider-failure, log/trace redaction, and credential-canary tests |
| Async completion after pause/delete/revoke | Lease/work/publication epochs, single-use grants, idempotency, outbox or equivalent recheck | Race, restart, duplicate, cancel, delete, restore, revocation, and late-publication drills |
| Cross-tenant row/file/receipt/export leak | Complete mediation across every storage/publication surface plus lifecycle epochs | Seeded cross-tenant and stale-worker suite with zero observed leakage; finite-scope disclaimer |
| Telemetry re-identification or purpose drift | Explicit enrollment, minimization, purpose tags, retention/deletion, aggregation release review | Independent privacy/denominator review, differencing/linkage tests, consent withdrawal, no pre-approval collection |
| Support escalation abuse | Separate support principal and `SupportGrant`, JIT scope, MFA, audit, dual control for mutation | Compromised-support, cross-case/tenant, expired/revoked grant, notice, export, and emergency-stop tests |
| Receipt overclaim, tamper, replay, or sensitive-data leak | Claim-shaped ontology, integrity/authenticity, freshness/use counters, redaction, customer/operator separation | Acceptance-vs-effect, tamper/key-rotation/replay/supersession, scope omission, and redaction fixtures |
| Secrets, dependency, build, or deployment compromise | Managed secret store, least privilege, locked dependencies/SBOM, signed/reproducible artifacts where feasible, environment separation, rollback | Secret scan, dependency/container scan, provenance/signature check, staging journey, rollback and disaster-recovery drill |

## Acceptance gates and falsifiers

These are proposed acceptance criteria for a future pilot. None is claimed to pass today.

The release train is fail-closed and role-assigned:

| Release gate | Allowed scope | Accountable approver | Independent verifier | Required evidence and stopping rule | Current status |
|---|---|---|---|---|---|
| G0 — document/design | Brain artifact only; synthetic fixtures | Owner/product lead | Reviewer who did not author candidate bytes | Pinned sources, adversarial review, publication tests; any unresolved critical blocks publication | **In review**; no implementation authority |
| G1 — implementation/shadow | Clean worktree; synthetic or owned test data; no customer effects | Engineering owner + security/privacy approvers | Separate implementation verifier | A–D, threat fixtures, deletion/restore drill, supply-chain/deployment evidence; any cross-tenant effect or false green stops the run | **Not started** |
| G2 — narrow design-partner pilot | One tenant, one workflow, T0/T1 only unless separately approved | Product owner + tenant administrator + privacy/security owners | Verifier outside delivery path | A–G, signed DPA/consent/policy, staffed support/incident route, kill switch; any privacy event or unbounded effect stops processing | **Not authorized** |
| G3 — expanded authority | Same bounded workflow with approved T2/T3 actions | Product, security, privacy, tenant authority owner | Separate red-team/assurance owner | Destination/intent binding, dual control where required, readback/recovery, incident drills, measured economics; unresolved high-consequence claim blocks promotion | **Not authorized** |
| G4 — shared multi-tenant production | More tenants/regions/workflows | Executive product/security/privacy owners and customer contract authority | Independent security/privacy/reliability review | Repeated isolation, residency/key/subprocessor controls, support SLOs, external-facing terms, value/economic evidence; no finite suite is labeled proof of universal isolation | **Not authorized** |

Gate A–D are hard architectural and safety requirements. Gate E–G include provisional pilot metrics: they guide stop/continue decisions but are not universal benchmarks. Product metrics cannot waive a failed safety gate.

### Gate A — envelope integrity

Pass only if every fixture produces a transport/session-derived principal and tenant, a versioned purpose/consent binding, a valid authority grant, an execution reference, and claim-shaped evidence or an explicit unresolved state with recovery. Any model-originated/widened tenant, consent, authority, approval, destination, or evidence claim is a failure.

### Gate B — journey integrity

Pass only if restart, duplicate delivery, retry, pause, cancel, correction, support escalation, export, and deletion paths are tested against synthetic data. A healthy component with a broken first-mile journey is a failed release.

### Gate C — tenant isolation

Pass the approved suite only if a seeded second tenant cannot read or alter any first-tenant row, file, receipt payload, cache entry, export, publication, support artifact, or backup-restored object. The required observed result is zero leakage in that finite suite; it is regression evidence, not universal proof of isolation.

### Gate D — learning integrity

Pass only if technical status, task report, correctness, and business outcome remain distinct; missing feedback stays unknown; telemetry write failures remain in the denominator; consent withdrawal triggers bounded purge with a deletion receipt; aggregate releases resist differencing.

### Gate E — product value

The V0 promotion thresholds are provisional kill criteria, not observed results or universal benchmarks. Before expanding authority or tenancy, collect at least 20 eligible real-customer attempts across at least three active users or a predeclared equivalent for a smaller partner. Require:

- at least 80% of started enrollments reach the first submitted task without operator rescue;
- at least 70% of eligible tasks reach a customer-accepted or independently verified terminal result without operator rescue;
- median end-to-end task time improves by at least 30% against the same customer’s frozen baseline, or the customer predeclares an equivalent measurable quality/error benefit;
- the customer makes one explicit paid-continuation or renewal decision at a price that includes measured variable cost.

If the sample is too small or the comparison drifts, the result remains **needs-evidence** rather than being rounded up to product-market fit.

### Gate F — support and unit economics

Pass only if 100% of support cases link to a run receipt, suspected tenant/privacy events stop affected processing, ordinary cases meet the one-business-day acknowledgement target, median diagnosis time after an operator opens the case is at most 30 minutes, and support access auto-revokes. For a scale decision—not an exploratory pilot—require measured support labor at or below 25% of realized price and total variable cost at or below 50% of realized price per successful result. Otherwise keep the workflow concierge-scoped or stop it.

### Gate G — comparative architecture and economic ablation

Before attributing value to Hermes or the service envelope, run the same frozen workflow/data split through: (A) a deterministic workflow with no model, (B) a model-assisted workflow with the minimum safe boundary, and (C) the full envelope with receipts/recovery. Predeclare quality, time-to-first-verified-value, rescue minutes, incident/false-green rate, latency, infrastructure/model cost, and customer comprehension. Promote C only if its incremental verified value or risk reduction exceeds its incremental cost and review load. If A or B is equivalent within the predeclared margin, select the simpler system. Separately ablate customer-visible receipt detail and recovery UX; internal audit evidence remains mandatory even if a customer UI treatment is removed.

### Falsifiers

The architectural thesis is weakened if the pilot produces any of these results:

1. **Shadow mode shows** that the proposed crossing context does not stop a seeded authority, tenant, lifecycle, or evidence-status failure.
2. **If a hardened general Hermes profile shows** equivalent pre-context safety, tenant isolation, recovery, and support cost with materially less complexity, the dedicated-service recommendation should be withdrawn.
3. **If customer-visible receipts do not change** support diagnosis time, customer-perceived risk, or first verified value—and instead add confusion or latency—the receipt UI should be simplified or removed while internal receipts remain.
4. **If outcome capture shows** sparse, biased, or unstable labels, it should not drive optimization or retention claims.
5. **Model-swap replay** must test held-out tenant-local fixtures; if repeat-task quality collapses whenever the model changes, the claimed harness portability is weak.
6. **If customers do not** repeatedly use, pay for, or renew the narrow workflow despite acceptable reliability, the customer-value thesis is false for that workflow.
7. If review cost per accepted improvement does not decrease after the fixture and receipt corpus grows, the learning-loop efficiency claim is unsupported.

## What changes tomorrow — Kurultai routing

**Capsule basis:** `brain/status/kurultai-living-architecture-capsule.md`, generated `2026-07-21T16:28:44Z`, SHA-256 `c282af30ff8e1a03fd8d2eef215a031caf9dec61db34e0e613c11f5c5924d84e`, cited as S1. It is an L1 routing cache, not live runtime proof or a substitute for canonical verification.

| Route | Recommendation | Existing surface to extend | Boundary |
|---|---|---|---|
| **direct-now** | Treat this whitepaper and a future V0 envelope/fixture contract as Brain review artifacts. Reuse existing Brain receipt/proof-debt vocabulary without claiming that a complete runtime trace spine exists. | Brain whitepapers, manifests, review receipts, proof-debt language | Documentation and review only. No runtime mutation or completeness claim. |
| **gated-later** | If Buildroom approves an implementation, add the smallest missing ingress, grant, tenant-state, lifecycle, support, evidence, deletion, and E2E mechanisms in the product repository; wire incidents/proof debt into existing review surfaces rather than creating another control room. | Product repository plus existing Buildroom/Kanban/Control Room for implementation review and incidents | Requires owner-approved plan, TDD, independent verification, deployment, customer-consent, and provider/runtime gates. Existing traceability gaps remain blockers rather than reused guarantees. |
| **needs-evidence** | Whether a hardened general Hermes profile can safely replace the dedicated envelope; receipt effects on trust; outcome-label validity; retention impact; privacy-safe aggregation; support economics; cross-tenant and deletion guarantees. | Synthetic journeys, design-partner pilot, independent verifier, proof-debt rows | Do not convert these hypotheses into product claims before receipts exist. |
| **no-op** | New parallel control room, one Kanban card per customer event, hidden cross-tenant memory, autonomous policy promotion, public launch, customer outreach, payment, credential handling, provider/profile changes, or cron creation. | None | Outside this research/publication scope and separately approval-gated. |

**Proof-debt relation:** the paper reduces architecture ambiguity but does not close runtime or product proof debt. Open proof debt includes a complete trace/receipt spine, pre-context handling, trusted principal derivation and offboarding, support authority and staffing, cross-tenant row/file/cache/receipt/export isolation, lifecycle fencing, residency/key/subprocessor policy, backup erasure, telemetry denominator and privacy composition, retention enforcement, E2E execution, packaging/pricing, support cost, willingness to pay, renewal, and real customer outcome evidence. S12 is author-reconciled planning evidence pinned to a hash here; it remains `NO-GO`, and that exact hash has not been independently approved as an implementation contract.

**Runtime boundary:** no Hermes profile, gateway, bot, provider, cron, Kanban board, product repository, deployment, credential, payment, customer account, or public channel is changed by this paper. Publishing the final paper into Brain is the only intended mutation after the publication gate passes.

## Conclusion

Roughly speaking, customer-facing Hermes agents should look less like public versions of an operator and more like small, typed, restartable services. Hermes can supply reasoning and workflow depth, but identity, authority, state transitions, effect verification, customer recovery, tenancy, and deletion must live outside model discretion.

The reusable mechanism is the proof-carrying service envelope:

```text
principal × tenant_scope × purpose/consent × authority × evidence × recovery
```

Build one narrow workflow. Keep authority risk-tiered and reversible. Make every consequential crossing inspectable without exposing raw internals. Let explicit customer corrections become tenant-owned fixtures. Prove the whole journey, not just the answer. Then scale only the boundaries that have receipts.

## References

1. `brain/status/kurultai-living-architecture-capsule.md`
2. `brain/analyses/2026-05-02-parse-agents-paid-user-readiness.md`
3. `brain/docs/plans/2026-06-01-parse-complete-dogfood-repair-plan.md`
4. `brain/docs/plans/2026-06-01-parse-agent-trust-boundary-sprint.md`
5. `brain/docs/plans/parse-outcome-linked-telemetry-implementation-plan.md`
6. `brain/docs/plans/parse-outcome-linked-telemetry-task-0-revised-contract.md`
7. `brain/analyses/2026-07-20-parse-outcome-linked-telemetry-implementation-plan-critical-review.md`
8. `brain/analyses/2026-07-20-parse-outcome-linked-telemetry-critical-review-independent-validation.md`
9. `brain/analyses/2026-05-18-agent-e2e-testing-skill-design-memo.md`
10. `brain/analyses/2026-05-18-hermes-openclaw-observability-design-memo.md`
11. `brain/docs/plans/parse-improvement-loop-design.md`
12. `brain/docs/plans/2026-07-25-kublai-hulegu-job-search-agent-implementation-plan-v3.md` (pinned in S12 to SHA-256 `07e885de133fc742d33b8a2f8bae25ce25d1d0da5c5efbbaf0d56f38bb3a0ac9`; mutable `NO-GO` planning candidate)
13. `brain/analyses/2026-07-13-satya-nadella-reverse-information-paradox.md`
14. `brain/analyses/2026-06-17-ai-agent-moat-harness-data-flywheels.md`
15. Hermes sessions: `[private session reference withheld]`, `20260721_010341_3a5072`, `20260724_113023_a84419`, `20260725_023435_c2f08d`.
