---
type: analysis
status: active
created: 2026-07-24
updated: 2026-07-24
sources: 15
tags: [whitepaper, typed-evidence, authority-separation, agent-architecture, kurultai, verification, loop-engineering]
---
<!-- public-redacted-v1; canonical-source-sha256: 5d6e1e70dd50697399b43c8ea5fe89fb022753b3ea3f770a62d26dfe79e0e451 -->

# Typed Evidence and Authority-Separated Agent Architecture

## Abstract

LLM agents fail in a way that traditional software does not: silently, stochastically, confidently, and compositionally. An agent can produce a plausible-looking output that passes surface inspection, with no exception thrown and no crash. Across 40+ external `/study` analyses, four accepted synthesis packets, a 70-row agent doctrine library, and the implementation of a bounded typed planning system (Solution Graph), every durable agent-improvement proposal converges on the same architectural response to this asymmetry: **typed evidence at every boundary, structural authority separation between roles, and adversarial revision as a mandatory quality gate.**

This whitepaper synthesizes the cross-source convergence, names the shared invariant — **typed evidence is not a development convenience in agent systems; it is the primary structural defense against stochastic failure** — and provides one concrete worked example: an independent adversarial review found 3 defect classes in a system that had 42 passing tests. The paper is honest about what has been proven (implementability, convergence, one defect-detection instance) versus what awaits evidence (operational benefit, compounding, integration effects).

## The core problem: stochastic failure asymmetry

Traditional deterministic software fails predictably: an exception is thrown, a type error occurs, a test fails. The failure is local, immediate, and visible.

LLM agents fail differently:

- **Silently**: a plausible-looking but wrong output passes surface inspection. No exception, no crash.
- **Stochastically**: the same input can produce a correct result 90% of the time and a subtly wrong result 10% of the time. Testing once is insufficient.
- **Confidently**: the agent's own confidence is not evidence. "I'm 99% sure" and "I'm 50% sure" are both prose claims without independent verification.
- **Compositionally**: errors propagate through multi-hop chains. 90% per hop becomes 73% over three hops, and the failure is invisible without typed intermediate-state inspection.

This asymmetry is the whitepaper's central insight. It means that typed evidence, authority separation, and adversarial revision — which in deterministic software are development conveniences — become **necessary failure-detection mechanisms** in agent systems. The model's own output cannot serve as evidence of its own correctness; only typed artifacts crossing independently verified boundaries can.

### The worked example

The Solution Graph is a bounded typed planning system implemented in Python with 45 regression tests. After its initial publication (42 tests, all green), an independent delayed adversarial review found three defect classes:

1. **Weak-over-strong evidence supersession**: an observation with lower source authority could displace one with higher authority.
2. **Reverse chronology**: a superseding observation with an earlier timestamp was accepted.
3. **Authority smuggling through nested v1 context**: malformed nested contract fields could carry unauthorized structures.

All three were fixed and verified. But the point is not the fixes — it is that **42 passing tests did not prevent three real defect classes from shipping.** Only an independent adversarial pass with fresh eyes surfaced them.

This is one observed instance, not a general rate. It may reflect an unusually weak initial test suite or an unusually thorough reviewer. What it establishes is that adversarial revision can catch defects that normal testing misses — which is necessary but not sufficient evidence that it does so reliably.

## Corpus & Evidence

### Source manifest

| # | Source | Type | Evidence grade | Path |
|---|--------|------|----------------|------|
| 1 | Alex Zhang — Harnesses as compositional generalizers | Study analysis | A/B/C | `analyses/2026-07-21-alex-zhang-harnesses-compositional-generalizers.md` |
| 2 | lopopolo — Harness engineering | Study analysis | A/B+/C+ | `analyses/2026-07-21-lopopolo-harness-engineering.md` |
| 3 | Av1dlive — Evidence ladder | Study analysis | B | `analyses/2026-07-16-x-av1dlive-2076705482904101136-ai-agent-evidence-ladder.md` |
| 4 | NeilXbt — Structured handoff drift | Study analysis | B | `analyses/2026-07-14-x-neil-xbt-2076611845780058400-structured-handoff-drift.md` |
| 5 | Satya Nadella — Reverse information paradox | Study analysis | B | `analyses/2026-07-13-satya-nadella-reverse-information-paradox.md` |
| 6 | 0xWast3 — Graph engineering | Study analysis | B | `analyses/2026-07-23-x-0xwast3-2079899723947712845-graph-engineering.md` |
| 7 | Yassa v3 prior-art survey | Prior-art analysis | A (45 sources) | `analyses/2026-07-21-yassa-v3-external-prior-art.md` |
| 8 | Intent-completeness gate (synthesis) | Synthesis packet | B+ | `analyses/synthesis/2026-07-04-intent-completeness-pre-task-gate-andrej-synthesis.md` |
| 9 | Timescale loop promotion gate (synthesis) | Synthesis packet | B+ | `analyses/synthesis/2026-07-02-timescale-loop-promotion-gate-andrej-synthesis.md` |
| 10 | Substrate-first autonomy gate (synthesis) | Synthesis packet | B+ | `analyses/synthesis/2026-07-01-substrate-first-autonomy-gate-andrej-synthesis.md` |
| 11 | Agent Doctrine Library | Doctrine index | B+ | `concepts/agent-doctrine-library.md` |
| 12 | Solution Graph Phase 2 | Implementation + tests | A | `kurultai-repo/solution_graph/` |
| 13 | Solution Graph adversarial hardening | Remediation | A | commit `f5b8370` |
| 14 | Memory Is Leverage doctrine | Promoted doctrine | B+ | `concepts/agent-doctrine-library.md` |
| 15 | Kurultai Living Architecture | Architecture capsule | B | `status/kurultai-living-architecture-capsule.md` |

**Overall evidence grade: B+.**

### Circularity risk — acknowledged

7 of 15 sources are Kurultai-internal. The Solution Graph was designed using the doctrine library being synthesized. What mitigates this: the external sources independently arrived at the same patterns before Kurultai implemented them; the Yassa survey found convergence across 45 independent external projects; and no operational benefit is claimed without Phase 2.5 evidence. What is claimed: implementability, cross-source convergence, and internal consistency. What is **not** claimed: empirically proven operational benefit.

## Synthesis

### Theme 1: Typed evidence as the primary structural defense against stochastic failure

Every durable agent improvement across the corpus reduces to making latent state inspectable through typed, hashed, schema-backed artifacts. NeilXbt showed natural-language handoffs drift by week three while typed objects remained stable. Av1dlive formalized "no rung closes on a subordinate's prose." Zhang showed decomposition needs typed interfaces and reducers. lopopolo showed trajectories fail at boundaries where state doesn't cross as typed data.

The purpose is not developer convenience. It is stochastic-failure detection. An agent's output is prose; typed evidence converts that prose into inspectable data that an independent verifier can reject.

### Theme 2: Read-only planning before execution

A bounded planner that cannot execute surfaces incompatibilities before resources are committed. Three synthesis packets (substrate-first, intent-completeness, timescale) and the Solution Graph implementation all check before executing.

**Scoping**: These gates share an orientation but were developed independently. No evidence they compose without excessive conservatism.

### Theme 3: Code-level authority separation

The Yassa survey found 14 external projects converging on external enforcement — the agent should not hold ambient authority. At single-operator scale, code-level separation (Solution Graph can't execute; Yassa requires root) protects against model-side failures (self-deception, sycophancy) even when the same human plays all roles.

### Theme 4: Adversarial revision as mandatory gate

The worked example (3 defects after 42 green tests) is concrete evidence that adversarial review catches what normal testing misses. Per-check verdicts beat collapsed scores (NeilXbt) because heterogeneous failures need different repairs. A goal verified once is an assumption with a timestamp (Av1dlive).

### Theme 5: Owned learning loops — sound mechanism, untested strategic hypothesis

The mechanism (convert traces/corrections/evals into owned fixtures) is sound. The strategic claim (owned loops compound, rented loops don't) is compelling but has zero Kurultai-specific evidence. Decisive test: model-swap replay.

## What changes tomorrow

This is the concrete behavioral delta the whitepaper prescribes:

1. **Type every boundary-crossing artifact** — not for developer convenience, but because typed schemas are the only way an independent verifier can mechanically reject a stochastic failure. If an artifact crosses from one agent/role/system to another, it must carry a schema, a hash, a terminal state, and an authority declaration.

2. **Never let the planner execute** — even at single-operator scale. A read-only planner that can only recommend forces a checkpoint at every execution boundary. The agent that proposes the action must not be the agent that performs it.

3. **Run adversarial review after green tests, not instead of them** — the worked example shows that 42 passing tests did not prevent 3 real defect classes. Green tests are necessary but not sufficient. Adversarial review with fresh eyes is a separate quality gate.

4. **Mark every claim with its evidence grade and what would falsify it** — because agent outputs are confident by default, the habit of grading evidence and naming falsifiers is the structural defense against self-deception. A claim without a falsifier is an opinion.

5. **Route learning exhaust to owned files, not provider threads** — the strategic hypothesis is that owned fixtures compound while rented intelligence doesn't. Even without proof of compounding, the downside risk of not owning your learning loop (provider accumulates your intelligence) is asymmetric.

## Implications for Kurultai

| Finding | Route | What's proven vs untested |
|---|---|---|
| Typed evidence as stochastic-failure detector | **direct-now** | Proven: implementable, convergent. Untested: operational benefit |
| Read-only planning before execution | **direct-now** | Proven: implemented in Solution Graph. Untested: benefit vs baseline |
| Code-level authority separation | **direct-now** | Proven: 45 regression tests. Untested: catches model-side failures in practice |
| Adversarial revision as mandatory gate | **direct-now** | Proven: 1 worked example (3 defects/42 tests). Untested: general rate |
| Owned learning loop mechanism | **direct-now** | Proven: mechanism is sound. Untested: compounding claim |
| Shadow-mode measurement (Phase 2.5) | **gated-later** | The decisive evidence for all benefit claims |
| Model-swap replay test | **gated-later** | The decisive test for Theme 5 |
| Gate integration effects | **gated-later** | Do four gates compose or create conservatism? |
| Grant Solution Graph execution authority | **no-op** | Shadow evidence required first |

## Falsifiers

1. **Typed evidence doesn't improve outcomes**: Phase 2.5 shows typed plans accepted at same rate as untyped decisions with no verification improvement.

2. **Code-level authority separation is unnecessary at current scale**: Shadow mode shows zero model-side self-verification failures over 6 months.

3. **Owned learning loops don't compound**: Model-swap replay shows Brain fixtures lose portability across providers.

4. **Adversarial revision defect rate drops below 5%**: Future reviews find almost no CRITICAL findings, suggesting rubber-stamping.

5. **The synthesis adds no novel decision boundary**: Naming the unified pattern does not change any future review, architecture, or autonomy decision.

## Open Questions

1. Does pre-execution checking prevent task failures in practice? (Phase 2.5)
2. How quickly does typed evidence become stale?
3. Can Brain fixtures survive a provider change? (Model-swap replay)
4. Do the four pre-execution gates compose constructively?
5. What is the overhead cost per task of this architecture, and at what task size does it pay off?

## References

1. `analyses/2026-07-21-alex-zhang-harnesses-compositional-generalizers.md`
2. `analyses/2026-07-21-lopopolo-harness-engineering.md`
3. `analyses/2026-07-16-x-av1dlive-2076705482904101136-ai-agent-evidence-ladder.md`
4. `analyses/2026-07-14-x-neil-xbt-2076611845780058400-structured-handoff-drift.md`
5. `analyses/2026-07-13-satya-nadella-reverse-information-paradox.md`
6. `analyses/2026-07-23-x-0xwast3-2079899723947712845-graph-engineering.md`
7. `analyses/2026-07-21-yassa-v3-external-prior-art.md`
8. `analyses/synthesis/2026-07-04-intent-completeness-pre-task-gate-andrej-synthesis.md`
9. `analyses/synthesis/2026-07-02-timescale-loop-promotion-gate-andrej-synthesis.md`
10. `analyses/synthesis/2026-07-01-substrate-first-autonomy-gate-andrej-synthesis.md`
11. `concepts/agent-doctrine-library.md`
12. `kurultai-repo/solution_graph/` (commit `f5b8370`)
13. GitHub commit `f5b8370ecdfeb3b7ad169116e9eabbdb538d4fea`
14. `concepts/agent-doctrine-library.md` § Doctrine: Memory Is Leverage
15. `status/kurultai-living-architecture-capsule.md`

---

*v3 (final): Revised after R2 critique. Restructured to lead with stochastic failure asymmetry and worked example (R2-1). Added §"What changes tomorrow" with 5 concrete behavioral prescriptions (R2-2). Scoped worked example to single instance (R2-3). Addressed overhead in Open Questions (R2-4). Softened "only defense" to "primary structural defense" (R2-5).*
