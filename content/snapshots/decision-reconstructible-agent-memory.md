---
type: whitepaper
status: published
version: 3
created: 2026-08-02
published: 2026-08-02
topic: broad synthesis
sources_count: 10
evidence_grades: "A: 3, B: 6, C: 1, D: 0"
central_evidence_grade: B
architecture_evidence_grade: B
novelty_evidence_grade: C
outcome_evidence_grade: C
review_rounds: 2
tags: [synthesize, whitepaper, agent-memory, evidence-admission, reuse-limit, rationale-origin, upgrade-on-use]
---
<!-- public-redacted-v1; canonical-source-sha256: 04eb538ee10c969d7a4be11aa7ce3bb2c51a659b3bf918ca8a9206f6e11925a8 -->

# Reuse-Class Admission for Agent Memory: Upgrade Evidence When Context Becomes Consequential

## Abstract

Agent memory should separate storage from evidentiary eligibility. A low-risk observation may be stored cheaply when it is source-bound, scoped, reversible, and explicitly limited to non-consequential reuse. The same observation becomes ineligible as declared evidence for a consequential object until a target-use policy assigns the risk class and the evidence edge is upgraded.

The v3 contribution is deliberately narrower than v1 and v2. It is not a new general Decision Reconstruction Contract, not a fourth universal gate, and not a claim to reconstruct actual cognition. The surviving mechanism is two fields, `reuse_limit` and `rationale_origin`, plus an `upgrade_on_use` rule. These change an evidence-admission decision before, and independently of, final action authority: a consequential object cannot earn `evidence_supported: pass` from an incomplete declared evidence manifest, even if a separate authority gate would also block the final action.

The paper demonstrates a logical and policy polarity using authored fixtures and examples. It does not claim empirical efficacy, production value, runtime authority, customer benefit, reviewer calibration, incident reduction, or external publication. The executed toy fixture first failed RED with `ModuleNotFoundError` before implementation and then passed 6/6 standard-library `unittest` cases; that proves only toy invariants in a tiny local model.

Central evidence is graded B for architectural coherence and implementability, novelty C because the contribution is a small recombination over existing local mechanisms, and outcome C because no production effect is measured.

## Problem Space

Most agent-memory systems blur three questions that should remain separate.

First: may a record be stored? Second: may it count as evidence for a later object? Third: may the later object authorize an action? Provenance, event sourcing, typed evidence, receipts, authority separation, contradiction review, service envelopes, and Verification Solvency already answer much of this surface. They track where a record came from, who emitted it, what typed support exists, who may approve an effect, whether claims are independently reviewable, and whether the system has independent-review capacity for consequential commits.

The unresolved gap is consequence-sensitive reuse. A record that was safe to retain yesterday as a low-risk observation can become unsafe today when cited as support for doctrine, policy, autonomous action, customer-visible effect, memory promotion, contradiction disposition, privileged tool use, or another consequential decision. Write-time admission cannot know every future target use. Treating “stored” as “eligible evidence” lets cheap observations become load-bearing by citation drift. Treating every observation as if it were already consequential creates ceremony, privacy risk, and review debt.

The decision-changing question is therefore narrower than “can we reconstruct the decision?” It is: when a consequential object declares evidence, can deterministic policy reject an edge from a lightweight record before final action authority is even considered? V3 answers yes, but only under a modest mechanism. A stored record carries `reuse_limit`. Rationale fields carry `rationale_origin`. On every consequential target use, a policy-owned classifier assigns target risk and the declared evidence manifest must be complete. If an evidence edge points to a `reuse_limit: non_consequential` record without an upgrade contract, the object cannot earn `evidence_supported: pass`.

This is a logical/policy polarity, not an empirical claim. It shows that the architecture can express a decision that prior write-time storage admission does not express cleanly: admit storage, reject evidentiary eligibility for consequential use until upgraded.

## Corpus & Evidence

This paper uses ten sources: eight evidence sources, one Dreamer hypothesis generator, and one executed fixture.

| ID | Source | Grade | Role |
|---|---:|---:|---|
| S1 | `Lobu event-sourced agents — source-to-mechanism analysis` | A | Event-sourced separation of source truth, observation history, projection, correction, supersession, and action authority; includes an executed 6/6 toy. |
| S2 | `Three outbound links do not prevent orphan notes` | B | Shows mechanical reachability and semantic usefulness are different; includes an executed toy counterexample. |
| S3 | `Obsidian vault that argues back — premise-paired contradiction review` | B | Premise-paired contradiction cards, quote/hash binding, typed dispositions, human review, and review-yield discipline. |
| S4 | `Critical Decision Method — incident replay for extracting expert judgment` | A | Critical Decision Method adaptation; especially expected cues, negative cues, counterfactuals, and the warning to separate observed, recalled, inferred, and hypothesized claims. |
| S5 | `Brain Weekly-Safe Optimizer — 2026-08-02` | B | Real local maintenance corpus with stale and sparse records; shows why cheap observations should not silently become archive, merge, or policy authority. |
| S6 | `Typed Evidence and Authority-Separated Agent Architecture` | B | Supports typed evidence, authority separation, and adversarial review as structural defenses, while not itself supplying the reuse fields. |
| S7 | `Verification Solvency — Why Agent Commit Rates Must Be Bounded by Independent Review Capacity` | B | Defines Verification Solvency as independent-review capacity and labels authored fixtures as policy polarity, not production efficacy. |
| S8 | `Hermes Behind the Service Boundary — Trustworthy Customer-Facing Agents` | B | Supplies risk-tiered service-envelope, privacy, retention, revocation, and minimum-safe-projection discipline. |
| S9 | `Dreamer design packet — Reconstructibility Gate hypothesis` | C | Hypothesis generator only; its “fourth gate” framing is rejected as overbroad. |
| S10 | `Executed local toy fixture (source withheld from the public edition)` | A | Executed local toy: RED `ModuleNotFoundError` before implementation, then 6/6 `unittest` pass after implementation. |

Evidence distribution is `A: 3, B: 6, C: 1, D: 0`. The central claim earns B only for architectural coherence and implementability. Novelty is C because only two fields and one rule survive collision with prior work. Outcome evidence is C: there is no production implementation, no customer value evidence, no incident-rate evidence, no runtime integration, and no external publication claim.

## Synthesis

## Decision-Changing Rule

A low-risk observation may be stored, but it is ineligible as declared evidence for a consequential object until all of the following are true:

1. The target object declares a complete evidence manifest.
2. A policy-owned target-use classifier, not the proposer, assigns the target risk class.
3. Every declared edge from a lightweight source is either within that source's `reuse_limit` or carries an explicit upgrade reference.
4. Every rationale field used by the target object carries `rationale_origin`.
5. Deterministic validators find no missing manifest edge, missing origin, incomplete negative cue, missing privacy projection, or non-consequential source reused consequentially without upgrade.

The result is an evidence-admission decision, not an action-authorization decision. A consequential `ActionApproval` may still fail authority, Verification Solvency, rollback, privacy, or human approval after the evidence manifest passes. The key polarity is earlier: an incomplete evidence manifest cannot earn `evidence_supported: pass`.

### The Two Fields

`reuse_limit` belongs to records that may later be cited. Its minimum values are:

```yaml
reuse_limit: non_consequential | target_policy_required | consequential_ready
```

`non_consequential` means the record may be stored and retrieved for local, additive, reversible, non-actionable context. It may not count as declared evidence for consequential objects without upgrade. `target_policy_required` means no standing reuse class exists; the target-use policy must decide at citation time. `consequential_ready` means the record already carries the evidence, privacy, rationale-origin, and review metadata required by the relevant policy profile.

`rationale_origin` belongs to rationale-bearing fields:

```yaml
rationale_origin: contemporaneous_record | reviewer_inferred | post_hoc_hypothesis | unknown
```

`contemporaneous_record` may support what the actor or system recorded as its rationale at decision time. `reviewer_inferred` and `post_hoc_hypothesis` may support later review notes or hypotheses, but may not impersonate original rationale. `unknown` is an honest state, not a defect by itself; it becomes blocking only when the target policy requires original rationale.

### Upgrade on Use

`upgrade_on_use` fires at target use, not original storage. Stale lightweight records are reclassified on every consequential use. A source-bound observation from August 2, 2026 does not keep a permanent risk class merely because it was harmless when captured.

Enforcement is policy-owned. The proposer may suggest a risk class, but the policy classifier assigns it from object type, operation, resource, data class, destination, reversibility, tenant or operator policy, and current lifecycle state. The target object must then declare its evidence manifest: each evidence edge, source reuse limit, upgrade reference where needed, rationale origin, freshness, limitation, privacy projection, and review state.

Uncited latent context is a known blind spot. A model may be influenced by prior context without declaring an evidence edge. That context cannot count toward `evidence_supported: pass`. If post-hoc review detects that an emitted object depended on undeclared lightweight context, the downstream object is superseded or revoked, routed to re-review, and any later object citing it must follow the supersession chain.

### Optional Imported-Field Profile

The larger Decision Reconstruction Contract is useful as an optional imported-field profile, not the novelty. Existing local sources already provide most of it: as-of evidence from event sourcing, negative cues and counterfactuals from CDM, quote-bound premise pairs from contradiction review, privacy and retention from Hermes envelopes, and independent-review capacity from Verification Solvency.

A consequential profile may import fields such as `as_of_evidence`, `negative_cues`, `alternatives_considered`, `counterfactual_sensitivity`, `privacy`, `review_dimensions`, and `downstream_edges`. Those fields are valuable for audit, but they should not be named as the new primitive. V3's contribution is the smaller admission polarity: reuse class plus rationale origin plus upgrade on target use.

## Mechanisms

### Admission Flow

```text
record stored
  -> carries provenance, scope, time, and reuse_limit
  -> later target object declares consequential use
  -> policy classifier assigns target risk
  -> target evidence manifest declares cited edges
  -> deterministic validator checks edge eligibility
  -> reviewer checks semantic sufficiency where required
  -> evidence_supported pass/fail/unresolved
  -> separate authority and Verification Solvency gates decide action eligibility
```

### Five Deterministic Validators

| Validator | Deterministic check |
|---|---|
| `manifest_complete` | Consequential objects must declare object type, target-use class, policy ref, evidence edges, and terminal evidence status. Missing manifests fail closed. |
| `reuse_edge_upgrade` | Any edge from `reuse_limit: non_consequential` to a consequential target must include an `upgrade_contract_ref`; otherwise the target cannot pass evidence support. |
| `rationale_origin_present` | Every rationale, alternative, counterfactual, and reviewer-disposition field used by the target must have an allowed `rationale_origin`. |
| `negative_cue_shape` | Load-bearing absence claims must include expected cue, expectation source, observation window, observer capability, wording, absence evidence when required, and confidence; `confirmed_absent` requires instrumented observer capability. |
| `minimum_safe_projection` | Sensitive contexts must expose only the minimum safe projection required for review, with data class, sensitivity tier, access scope, retention class, deletion semantics, and private reference or digest when full rationale would overcapture. |

### Three Reviewer Checks

| Reviewer check | Why deterministic validation is insufficient |
|---|---|
| `semantic_impersonation` | A validator can check `rationale_origin`, but a reviewer may need to decide whether prose still launders inferred rationale as original intent. |
| `cost_proportionality` | Authoring and review minutes must be judged against target risk and value; this cannot be reduced to field presence. |
| `policy_conflict_resolution` | When policies genuinely conflict, a reviewer must decide whether the declared rationale and alternatives support the chosen route. |

### Executed Fixture

The fixture under `Executed local toy fixture (source withheld from the public edition)` is a tiny standard-library toy, not an implementation plan. Before the implementation module existed, the test import failed RED with `ModuleNotFoundError`. After adding `decision_reuse_contract.py`, `python3 -m unittest` passed 6/6 tests.

The toy checks six authored invariants: low-risk observations admit lightweight; non-consequential sources require upgrade when reused consequentially; upgraded sources can become eligible for review; inferred rationale cannot impersonate original rationale; `confirmed_absent` requires instrumentation; and sensitive decisions require privacy fields. It does not test production policy, semantic citation detection, reviewer quality, privacy leakage, runtime enforcement, customer value, or correct risk classification.

## Threat Model and Costs

The main threat is evidence laundering. A cheap record enters memory as harmless observation, later appears in a consequential object as if it were adequate evidence, and the system treats citation as support. The control is not to block storage. The control is to block unsupported evidentiary edges.

Additional threats:

| Threat | Control |
|---|---|
| Hindsight laundering | `rationale_origin` prevents inferred or post-hoc explanation from impersonating contemporaneous rationale. |
| Proposer self-classification | Target-use risk is assigned by policy-owned classifier, not proposer. |
| Missing evidence manifest | Consequential objects fail closed when manifest edges are absent or incomplete. |
| Uncited latent context | Latent context cannot count toward evidence-supported status; detection triggers supersession, revocation, and re-review. |
| Stale lightweight records | Reclassify on every consequential use; no standing consequence class survives indefinitely. |
| Rationale corpus as breach target | Data-minimization-first rule: capture the least sensitive rationale adequate for review; prefer digest-plus-private-reference for high-sensitivity cases. |
| Privacy projection leakage | Minimum-safe-projection invariant; public/customer projections must not reveal more than needed or omit uncertainty while preserving a success label. |
| Verification category error | Verification Solvency remains independent-review capacity, not schema completeness or checkability. |

Costs are real. The mechanism adds edge declarations, policy classification, upgrade references, reviewer time, privacy projections, and revocation handling. For low-risk observations this would be excessive, so lightweight storage remains available. For consequential objects the proposed cost is justified only if shadow replay shows decision deltas or false-confidence reduction at acceptable review cost.

## Worked Examples

These are authored illustrations of policy polarity, not empirical evidence.

| Illustration | Prior likely route | Reuse-class route | Label |
|---|---|---|---|
| Source capture records “file X observed at time T with hash H.” | Admit as provenance-backed observation. | Admit lightweight with `reuse_limit: non_consequential`. | Positive: cheap storage preserved. |
| Optimizer note reports sparse Dreamer fragments and recommends review, but performs no move/archive. | Existing approval gates already block archive. | Same practical route; observation remains non-consequential. | No-delta: avoids inflated utility claim. |
| Future policy draft cites that optimizer note as evidence for auto-archiving fragments. | Authority may later block action, but the citation may look supported. | Evidence edge fails until target policy assigns risk and upgrades source. | Positive: evidence admission changes before authority. |
| Contradiction card has quote-bound premise pairs but no reviewer disposition rationale. | Candidate enters review queue. | Cannot become doctrine-changing memory until rationale-origin and disposition manifest exist. | Positive: candidate evidence is not disposition evidence. |
| Action approval cites “no approval receipt observed” from a partial manual search. | May appear plausible in prose. | Negative cue fails unless window, observer capability, wording, evidence ref, and confidence are declared; `confirmed_absent` fails without instrumentation. | Positive: absence laundering blocked. |
| Low-risk internal note is used in a medium-risk review solely as background, not declared evidence. | Might be included in context. | No pass credit; if not a declared edge, it cannot support `evidence_supported`. | No-delta: context allowed, support denied. |
| Policy classifier conservatively marks a borderline local documentation change as consequential because it mentions security doctrine. | Prior controls may allow a lightweight edit. | Upgrade required, possibly delaying a harmless improvement. | False-reject: accepted as cost to measure in shadow protocol. |

## Implications for Kurultai

| Finding | Route | Rationale |
|---|---|---|
| Add `reuse_limit` and `rationale_origin` to future Brain memory-review schemas or fixtures | direct-now | Documentation and non-runtime fixtures can use the fields without granting authority. |
| Treat incomplete evidence manifests as unable to earn `evidence_supported: pass` | direct-now | This is a review doctrine clarification, not a runtime mutation. |
| Use a policy-owned target-use classifier in future implementation designs | gated-later | Requires schema, tests, owner approval, and independent review before any runtime reader depends on it. |
| Add supersession/revocation handling for post-hoc undeclared evidence detection | gated-later | Needs integration with existing event-sourced supersession and review queues. |
| Run the shadow protocol before production adoption | gated-later | Requires fixed corpus, reviewers, thresholds, privacy guardrails, and no live external effects. |
| Treat this whitepaper as runtime authority | no-op | It grants no code, cron, provider, customer, public-posting, or autonomous-action authority. |

Verification Solvency remains separate: Kurultai may have a complete evidence manifest and still be unable to commit if independent-review capacity for the risk class is unavailable. Completeness is not capacity.

## Falsifiers

1. If a blinded shadow replay shows `reuse_limit` and `upgrade_on_use` never change evidence-admission decisions beyond existing authority gates, the mechanism should be narrowed to documentation legibility or removed.
2. If false rejects exceed the pre-registered per-run tolerance without catching meaningful false-supported edges, the policy is too conservative.
3. If reviewers cannot reliably distinguish `contemporaneous_record`, `reviewer_inferred`, and `post_hoc_hypothesis` in held-out cases, `rationale_origin` is not operationally useful.
4. If undeclared latent context dominates consequential decisions and cannot be detected often enough for supersession to matter, manifest validation is only a partial control and should be labeled accordingly.
5. If privacy review shows rationale capture creates a more dangerous durable corpus than the evidence risk it reduces, the default should shift further toward digest-plus-reference or no capture.
6. If authoring plus review minutes exceed the pre-registered cost ceiling for low observed decision delta, the rule should be restricted to high-risk classes.
7. If policy-owned risk classification is routinely overridden or rubber-stamped by proposers, the enforcement model fails.

A proposed shadow protocol should set thresholds per run before unblinding. These thresholds are proposal-local and adjustable before execution, never universal. An operator might require, for example, a minimum decision-delta rate, a maximum false-reject rate, a maximum median review-minute cost, zero hard-safety false accepts, and zero privacy overcapture incidents. The exact values must be set by the operator before reviewers see outcomes.

## Open Questions

Who should own the first target-use classifier for Brain: a schema-only deterministic policy, a reviewer-owned checklist, or a small policy service? How should uncited latent context be detected without creating broad surveillance over prompts and private notes? What is the smallest safe upgrade artifact for high-sensitivity records where full rationale would overcapture? How should supersession propagate through published analyses, doctrine pages, and agent context caches? What denominator should Kurultai use for shadow replay: consecutive historical decisions, fixed risk-class samples, or authored adversarial fixtures plus real cases?

## Revision History

| Version | Date | Changes |
|---|---|---|
| v1 | 2026-08-02 | Proposed a broad Decision Reconstruction Envelope as a new memory boundary. |
| v2 | 2026-08-02 | Downgraded “fourth gate,” separated object types, added rationale-origin concepts, low-risk bypass, privacy fields, validators, and shadow protocol. |
| v3 | 2026-08-02 | Narrowed novelty to `reuse_limit`, `rationale_origin`, and `upgrade_on_use`; moved larger contract to optional imported-field profile; corrected evidence count and grades; reported executed fixture honestly; split deterministic validators from reviewer checks; added data-minimization-first privacy rule, minimum-safe-projection invariant, policy-owned risk classification, stale reclassification, supersession/revocation, and proposal-local pre-run thresholds. |

## Revision log

Two independent adversarial rounds were completed before this candidate. The three R1 CRITICAL findings were resolved by removing the universal fourth-gate claim, replacing ambiguous reasonableness with typed evidence-admission states, and abandoning any claim to reconstruct actual cognition. The three R2 CRITICAL findings were addressed by labeling authored examples as policy-polarity illustrations rather than efficacy evidence, narrowing novelty to two fields plus one upgrade rule, and making the behavioral delta an evidence-edge admission decision that is separately falsifiable from final action authority. Remaining MAJOR limits are explicitly preserved as partial dispositions, falsifiers, and gated-later evidence work rather than silently called complete.

### R1 and R2 Disposition Table

| Finding | Severity | v3 disposition |
|---|---|---|
| R1 F1 — new decision boundary not established | CRITICAL | Resolved by narrowing to evidence-edge admission, not broad DRC novelty. |
| R1 F2 — “reasonable” ambiguous | CRITICAL | Resolved by replacing reasonableness with typed pass/fail/unresolved evidence-admission language. |
| R1 F3 — actual cognition cannot be reconstructed | CRITICAL | Resolved; paper claims only rationale-origin labeling and does not reconstruct cognition. |
| R1 F4 — negative cues fabricated | MAJOR | Partially resolved; deterministic shape checks plus reviewer judgment remain necessary. |
| R1 F5 — low-risk bypass underdefined | MAJOR | Resolved in v3 by target-use policy classifier, stale reclassification, and upgrade-on-use enforcement. |
| R1 F6 — evidence grades inflated | MAJOR | Resolved by sources_count 10, Dreamer as hypothesis only, central B, novelty C, outcome C. |
| R1 F7 — privacy shallow | MAJOR | Resolved with data-minimization-first and minimum-safe-projection rules. |
| R1 F8 — decision logs vs memory admission | MAJOR | Resolved by separating storage, evidence eligibility, and action authority. |
| R1 F9 — schema ceremony without validators | MAJOR | Partially resolved; 5 deterministic validators, 3 reviewer checks, and toy fixture, but no production enforcement. |
| R1 F10 — falsifiers not executable | MAJOR | Partially resolved; shadow protocol requires per-run thresholds before unblinding. |
| R1 F11 — worked example too favorable | MINOR | Resolved by replacing seven favorable cases with positive, no-delta, and false-reject illustrations labeled policy polarity. |
| R1 F12 — Dreamer framing inherited | MINOR | Resolved; Dreamer is a C-grade hypothesis generator only. |
| R2 F1 — authored cases mistaken for evidence | CRITICAL | Resolved; examples are labeled policy polarity, not empirical evidence. |
| R2 F2 — novelty survives only as two fields | CRITICAL | Resolved; title and contribution now match two fields plus upgrade rule. |
| R2 F3 — utility unfalsifiable | CRITICAL | Partially resolved; decision-changing claim is narrowed to evidence admission and falsified by no-delta shadow replay. |
| R2 F4 — validators not all mechanical | MAJOR | Resolved by splitting deterministic validators from reviewer checks. |
| R2 F5 — cost unmeasured | MAJOR | Partially resolved; per-run cost thresholds required before shadow execution. |
| R2 F6 — evidence grades inflated | MAJOR | Resolved by corrected count and no schema claim from source S6. |
| R2 F7 — upgrade behavior lacks owner | MAJOR | Resolved by policy-owned target-use classifier, declared manifest, stale reclassification, and supersession/revocation route. |
| R2 F8 — privacy machinery creates attack surface | MAJOR | Resolved by data-minimization-first rule and rationale-corpus threat. |
| R2 F9 — worked hard case not hard | MINOR | Resolved by replacing hard-case claim with policy-polarity illustrations. |
| R2 F10 — shadow thresholds missing | MINOR | Resolved by requiring proposal-local thresholds before execution and unblinding. |

## References

1. `Lobu event-sourced agents — source-to-mechanism analysis`
2. `Three outbound links do not prevent orphan notes`
3. `Obsidian vault that argues back — premise-paired contradiction review`
4. `Critical Decision Method — incident replay for extracting expert judgment`
5. `Brain Weekly-Safe Optimizer — 2026-08-02`
6. `Typed Evidence and Authority-Separated Agent Architecture`
7. `Verification Solvency — Why Agent Commit Rates Must Be Bounded by Independent Review Capacity`
8. `Hermes Behind the Service Boundary — Trustworthy Customer-Facing Agents`
9. `Dreamer design packet — Reconstructibility Gate hypothesis`
10. `Executed local toy fixture (source withheld from the public edition)`