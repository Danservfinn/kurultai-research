---
title: "Self-Improving AI Needs Laws It Cannot Rewrite"
subtitle: "Why green tests do not prove a governed release"
version: "0.7-proposal"
date: "2026-07-24"
status: "local editorial candidate"
format: "X Article / technical proposal"
publication_ready: false
public_publish_requires_approval: true
x_staging_state: "not_staged"
status_snapshot_utc: "2026-07-24 01:21:32 UTC"
evidence_boundary: "Yassa-specific results are internal engineering reports; no external audit or certification is claimed"
---

# Self-Improving AI Needs Laws It Cannot Rewrite

*Why green tests do not prove a governed release*

**Self-improving AI needs rules its proposing loop cannot rewrite.** Agents can already propose code changes, run evaluations, and retain higher-scoring candidates, but in internal engineering work we rejected a locally green Yassa v3 release because its evidence did not prove that the reviewed source and packaged binaries were the same object.

So what must be true before an agent may call one of its own changes an improvement? The answer is a governed state-transition system with authority outside the proposing loop, exact artifact provenance, deterministic recovery, and a canonical history that the loop cannot rewrite.

## Four controls turn self-improvement from a score into a governed claim

Yassa is our proposal for that system. The name refers to laws the proposing loop is not authorized to change. Its design rests on four complementary control objectives:

1. **Authority stays outside the proposer.** The process that suggests a change cannot promote, clear, roll back, or count it.
2. **Provenance binds one exact object.** Reviewed source, tested binaries, approvals, release manifest, and installed bytes must share a verifiable identity.
3. **Transitions remain recoverable under interruption.** Every mutation ends committed, safely aborted, or quarantined; unexplained state never becomes success.
4. **Canonical history determines what counts.** Append-only events define outcomes, while dashboards, counters, and receipts remain rebuildable projections.

These controls answer different questions: who may act, what is being acted on, how an action survives failure, and how the result enters history. Weakness in any one of them invalidates the improvement claim.

This is not a report of a production deployment. It is a proposal shaped by rejected implementations, a remediated source candidate, a detached HOLD release, and internal reviewing-agent checks. In the current legacy records, no entry has a countable clearance, and the `fixes_landed` projection remains zero.

## Authority must stay outside the proposer

Most self-improvement diagrams end too early: observe a failure, propose a patch, run a benchmark, keep the winner. The Darwin Gödel Machine retains benchmark-improving changes [1], Red Queen co-evolves agents and evaluators [2], SEA adds anytime-valid admission [3], and SEVerA verifies programs against declared contracts [4].

Those mechanisms can answer whether a candidate met an evaluation rule. They do not, by themselves, answer whether that candidate had the right to alter a live system.

Deployment authority is a separate system. A candidate may score well while its evaluator reads mutable data. An approval may remain on disk after the state it approved has changed. A rollback may race with a clearance. A model may reach the governed destination through a path the broker never sees. None of this requires a malicious superintelligence. Stale state, ordinary concurrency, weak file permissions, and incomplete recovery are enough.

Yassa therefore separates proposal from authority. The unprivileged side may observe, build, test, and submit evidence. A narrow protected broker alone may promote, roll back, block, clear, recover, verify, and count. Its protocol must expose named operations rather than generic command execution. Requests cannot choose arbitrary paths, clocks, interpreters, environment controls, or test modes.

That design follows a broader runtime lesson from Progent, AgentSpec, and CaMeL: privilege decisions belong outside a vulnerable model [9–11]. Proof of Execution adds the requirement that effect credentials be exclusive to the governed runtime [12]. If the agent can bypass the broker and write the destination directly, a signed log is only a partial diary.

The broker is a small state machine with a closed protocol, protected state, explicit generations, and fail-closed checks. Neither vague intent nor a favorable score becomes standing permission to mutate later.

## One exact identity must connect review, test, approval, and activation

The most concrete Yassa failure was not a benchmark miss. It was a broken identity chain.

A v3 candidate passed its local unit and race suites, and static checks were green. The release packet appeared to connect source, binaries, plans, and approvals. Exact-object review found that the packaged binaries identified a dirty parent tree rather than the candidate revision named by the packet. Install and rollback checks also did not cryptographically validate the approvals they claimed to enforce.

That was enough to reject the release. The team could not prove that the source under review, the binaries under test, and the artifact proposed for installation were the same object. A green suite attached to object A says nothing decisive about object B.

> Testing source code is not enough. A governed release must prove that the reviewed source, tested binaries, approval record, and installed artifact are the same object.

The remediation tightened that chain around an immutable reviewed source revision and reproducible detached release. The packet verifies source identity, source and binary manifests, release evidence, and reproducibility across clean builds. A separate internal reviewing-agent session reported no findings for that exact object.

That result closes a source-remediation and detached-release review stage. It does not authorize installation. Generated working outputs created after the reviewed object do not replace the immutable review target, and a current working tree need not be described as clean for the reviewed release to remain identifiable.

Supply-chain systems already provide useful parts of this model. in-toto binds materials, products, steps, and authorized functionaries [18]. Rekor shows how a transparency log can expose inconsistent histories [19]. TUF contributes role separation, threshold signatures, expiry, rotation, and rollback protection [20]. Agent receipt systems explore receiver attestation, action records, append-only histories, and independently verifiable evidence [13–17].

Yassa applies those ideas to recursive improvement: approval must bind the candidate, baseline, plan, policy, evaluator version, evidence set, retry budget, decision rule, expiry, nonce, authority generation, and current state heads. Change one of them and the approval no longer matches.

## Every governed mutation must survive races and crashes

A release can have perfect provenance and still fail during activation. Promotion may collide with rollback. A process may crash after writing new bytes but before recording the event. A database may commit while a compatibility export remains stale. On restart, the system may see a mixture that never existed as a valid state.

Yassa treats each mutation as a transaction with retained pre-state and a planned post-state. The authority records durable intent before applying effects. Recovery accepts only two byte-exact outcomes: the retained old state or the planned new state. If observed bytes match neither, the system quarantines the operation. It does not infer success from a convenient file, counter, or pointer.

```text
Untrusted proposal plane        Protected authority plane

Sense -> Propose -> Evaluate -> Request -> Broker -> Governed effect
                  |                |          |
                  +--- evidence ---+          v
                                     Canonical event ledger
                                               |
                                      projections / receipts
```

Verification and historical rollup must pause while an operation is applying or inconsistent. Otherwise a monitor can certify a half-transition that never existed as a complete governed result. The same serialization boundary must cover promotion, rollback, blocking, clearance, recovery, verification, and rollup.

Earlier candidates failed here. Internal reviewing-agent sessions reproduced post-rollback clearance, interfering shared transactions, accepted corrupted checkpoints, missed expiry checks, and recovery that mishandled a valid old state. Those were authority failures even when ordinary tests passed.

The acceptance test is mechanical: inject interruption at every persistence boundary, then require exactly one of three outcomes. The new state commits with a canonical event, the old state is restored with a durable abort, or the operation is quarantined for investigation. Any fourth outcome means the transition protocol is incomplete.

## Only canonical events may convert a landing into a counted improvement

A self-improving system will optimize whatever visible quantity becomes its score. The success counter therefore belongs outside the proposer’s write boundary.

Yassa distinguishes a landing from a counted improvement. A landing may be provisional while its rollback window, evidence checks, and reconciliation remain open. Clearance must revalidate the current landing and all bound evidence at execution time. Only then may one immutable clearance event and its counted projection commit together.

This distinction mattered in practice. According to internal engineering records, Yassa’s first apparent live improvement was promoted under a mislabeled artifact path. Its evaluation may have looked favorable, but the promoted object was not cleanly bound to the evidence used to justify it. The landing was rolled back, its history was preserved, and the count stayed at zero. A later landing remains uncleared and uncounted after its rollback window expired.

At the current snapshot, the legacy ledger contains three entries. None has a counting timestamp. One records the original landing, one its rollback, and one the later uncleared landing. The legacy action-yield projection also reports zero fixes landed.

Refusing to book an ambiguous win shows the difference between activity and improvement. A dashboard can be regenerated. A human-readable receipt can be regenerated. The canonical event history cannot be replaced by either without creating a shadow authority plane.

Iterative generative optimization depends on its editable surface, feedback oracle, credit horizon, experience batch, and held-out split [5]. AI Control, ControlArena, and SpecBench add adversarial oversight and held-out specification tests [6–8]. Yassa extends that discipline past evaluation: the clearance-time criterion stays attached to the event, so later evaluator changes cannot rewrite history.

## Six laws define the minimum authority contract

### Law 1: One protected broker serializes every governed mutation

Promotion, rollback, blocking, clearance, recovery, verification, and rollup pass through one authority. Governed destinations reject bypass writes.

### Law 2: One canonical event history defines what happened

Append-only events are authoritative. Counters, dashboards, exports, and receipts are derived. Disagreement forces a halt rather than a convenient reconciliation.

### Law 3: A rollback can never become countable

Clearance revalidates landing state and evidence at execution time. A rolled-back or blocked landing cannot increment the count through a stale approval.

### Law 4: Every approval binds one exact transition

Authorization binds operation, artifact, plan, policy, evaluator, evidence, nonce, expiry, authority generation, release manifest, and current state heads. It is expiring and single-use.

### Law 5: Recovery accepts only exact old or exact new bytes

After interruption, the authority accepts the retained pre-state or planned post-state. Any third state is quarantined, never reinterpreted as success.

### Law 6: Clearance and counting share one transaction boundary

The clearance event and counted projection commit in one database transaction after referenced evidence is durably retained and hash-bound. Receipts remain regenerable views.

These are proposed acceptance invariants: a candidate that violates one should be rejected even if it improves a benchmark.

## Builders can apply the model without adopting Yassa

Use this checklist before allowing any agent to modify a live system:

- Put promotion, rollback, clearance, and counting outside the proposer’s credentials and write boundary.
- Give the authority a closed operation protocol; do not expose generic commands or caller-selected runtime controls.
- Bind source, binaries, manifest, approvals, evidence, evaluator, and install target to one exact release identity.
- Make approvals scoped, expiring, single-use, and bound to current state heads and authority generation.
- Serialize all lifecycle operations through one broker and one explicit transition state machine.
- Persist intent and retained pre-state before applying a mutation.
- Inject crashes at every persistence boundary and require commit, safe abort, or quarantine.
- Recheck expiry, policy, signer separation, evidence, and landing state when the authorized action executes.
- Keep the canonical event ledger protected and treat every counter, dashboard, and receipt as derived.
- Anchor terminal history outside the authority’s local rewrite boundary so truncation and forks are detectable.
- Test direct bypass attempts against every governed destination.
- Retire legacy writers or convert them to refusal-only shims before migration.
- Separate maturity labels: designed, implemented, locally tested, internally reviewed, operator resealed, installed, migrated, authorized, and counted.
- Require real installation readback and power-loss testing before making production claims.

If a team cannot say which exact artifact was approved, which authority may activate it, what happens after a crash, and which immutable event makes it count, it does not yet have governed self-improvement.

## Current status remains HOLD despite a reviewed remediation

**Verified snapshot: 2026-07-24 01:21:32 UTC**

- Source remediation: **complete for the reviewed immutable source revision**
- Detached HOLD release verification: **complete**
- First fresh normal run: **four Unix-socket tests failed under macOS’s long default temporary path**
- Complete vendored normal suite in the project’s controlled short-temp-path environment: **passed**
- Controlled race suite in the same environment: **passed**
- Static analysis: **passed**
- Exact-object reviewing-agent review: **no findings**
- Release manifest: **production-ready false; installation authorized false**
- Operator reseal and required signatures: **not completed**
- Root installation, migration, bootstrap, and live clearance: **not performed**
- Root service end-to-end and power-loss matrix: **not performed**
- Autonomous landings: **not allowed by live authority**
- Code-phase authority: **not open**
- Legacy ledger entries with countable clearance: **0**
- Legacy `fixes_landed` projection: **0**
- Publication state: **local candidate; not staged; not published**

Historical candidates were reviewed in separate internal reviewing-agent sessions. The current exact-object no-findings result came from one separate reviewing-agent session. None of those sessions authored the object it reviewed, but all remain part of the same internal engineering environment. This is not an external security audit, independent certification, or unaffiliated reproduction. A human operator retains reseal, installation, migration, live-authority, staging, and publication decisions.

## The proposal has limits that governance cannot erase

Yassa does not defend against a compromised kernel or root account. External anchoring is needed to detect some privileged rewrites, and even an external witness can suppress evidence or fail.

A protected evaluator can still encode the wrong objective. Governance can prevent a proposer from silently changing the criterion; it cannot make that criterion wise. Statistical admission also remains vulnerable to distribution shift, adaptive search, and weak held-out tasks.

Receipts prove bounded claims. A receipt can show that a signer recorded an action under a policy. It cannot prove that no bypass path existed, that a claimed external effect occurred, or that every observer saw the same history.

The proposed authority also adds latency, operational work, and new failure modes. Its value at high improvement volume remains unproven. No unaffiliated party has reproduced the complete Yassa evidence chain, and no root installation or power-loss campaign has tested the design in its intended production boundary.

Finally, zero in the current legacy records does not show that Yassa improves agents. It means only that no recorded result has a countable clearance under the existing process.

## A credible self-improving system must be able to reject its own apparent success

Self-improvement should not mean that an agent produced a patch with a higher score. It should mean that an authority outside the proposing loop verified the exact artifact, preserved the evidence, survived concurrency and interruption, completed a reversible transition, and recorded the outcome under rules the proposer could not rewrite.

Yassa has not met that full standard. Its current source remediation and detached release evidence are stronger than the rejected candidates, but installation, migration, production authorization, and counting remain closed.

That boundary is the proposal’s main claim: refusal is a feature of credible self-improvement. If the system cannot reject a green candidate with broken provenance, quarantine unexplained state after a crash, or keep a rollback from becoming a win, its improvement count is not trustworthy.

## References

1. [Darwin Godel Machine: Open-Ended Evolution of Self-Improving Agents](https://arxiv.org/abs/2505.22954).
2. [The Red Queen Gödel Machine: Co-Evolving Agents and Their Evaluators](https://arxiv.org/abs/2606.26294).
3. [Self-Evolving Agents with Anytime-Valid Certificates](https://arxiv.org/abs/2607.00871).
4. [SEVerA: Verified Synthesis of Self-Evolving Agents](https://arxiv.org/abs/2603.25111).
5. [Understanding the Challenges in Iterative Generative Optimization with LLMs](https://arxiv.org/abs/2603.23994).
6. [AI Control: Improving Safety Despite Intentional Subversion](https://arxiv.org/abs/2312.06942).
7. [ControlArena — UK AI Security Institute](https://control-arena.aisi.org.uk/).
8. [SpecBench: Measuring Reward Hacking in Long-Horizon Coding Agents](https://arxiv.org/abs/2605.21384).
9. [Progent: Securing AI Agents with Privilege Control](https://arxiv.org/abs/2504.11703).
10. [AgentSpec: Customizable Runtime Enforcement for Safe and Reliable LLM Agents](https://arxiv.org/abs/2503.18666).
11. [Defeating Prompt Injections by Design (CaMeL)](https://arxiv.org/abs/2503.18813).
12. [Proof of Execution: Runtime Verification for Governed AI Agent Actions](https://arxiv.org/abs/2607.05397).
13. [Notarized Agents: Receiver-Attested Confidential Receipts for AI Agent Actions](https://arxiv.org/abs/2606.04193).
14. [NOA Agent Action Receipt](https://github.com/NordenSoft/noa).
15. [Right to History: A Sovereignty Kernel for Verifiable AI Agent Execution](https://arxiv.org/abs/2602.20214).
16. [Agent Authorization Gateway](https://github.com/4KInc/agent-authorization-gateway).
17. [Agent Evidence Receipt Format](https://github.com/aerf-spec/aerf).
18. [in-toto supply-chain integrity framework](https://github.com/in-toto/in-toto).
19. [Rekor transparency log](https://github.com/sigstore/rekor).
20. [The Update Framework reference implementation](https://github.com/theupdateframework/python-tuf).

---

## Document status

This v0.7 proposal is a local X Article candidate. It has not been staged or published. Yassa-specific results are presented as internal engineering reports, not external certification. Any staging or publication action requires separate exact approval and a fresh source/status check against the final candidate.
