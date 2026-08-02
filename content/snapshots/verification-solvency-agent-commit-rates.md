---
type: analysis
status: published
created: 2026-08-02
updated: 2026-08-02
sources: 8
tags: [whitepaper, agent-systems, verification, admission-control, governance, harness-engineering]
---

# Verification Solvency: Why Agent Commit Rates Must Be Bounded by Independent Review Capacity

*Version 1.0 — published August 2, 2026*

## Abstract

Agent systems can now generate candidate changes faster than humans or independent evaluators can verify them. That asymmetry creates a failure mode that ordinary permission systems do not solve: **verification insolvency**. A change may be well-typed, proposed by an authorized role, and supported by a high evaluator score, yet still be unsafe to admit because the system has no remaining capacity to independently verify its effects, rehearse rollback, or inspect cross-layer regressions.

This paper proposes a three-stage admission architecture for consequential agent changes:

1. measure a **quality delta vector** rather than one scalar score;
2. derive required evidence and authority from **blast radius and reversibility**;
3. reserve scarce independent-verification capacity before a candidate becomes commit-eligible.

The decision-changing boundary is the third stage. Typed evidence answers *what kind of proof exists*. Authority separation answers *who may approve*. Verification solvency answers *whether the system can afford to know what this change will do before effects become difficult to reverse*.

The proposal is a control law, not a claim of production efficacy. Its strongest supporting evidence is convergent: harness research treats model and surrounding control surfaces as a coupled system; evaluator research documents judge bias and the weakness of intrinsic self-correction; regression-testing practice turns failures into executable fixtures; and after-action evidence shows that throughput pressure can overwhelm nominal integrity controls when cross-check capacity is missing or inaccessible. The mechanism remains unproven at production scale. A shadow-mode experiment is specified to test whether it improves admission decisions without creating intolerable latency or false rejects.

## 1. Problem statement

The marginal cost of producing an agent-generated candidate is falling. A coding agent can open many branches. A research agent can propose many claims. An operations agent can prepare many remediations. A self-improvement loop can generate prompt, policy, or code variants continuously.

Verification does not scale at the same rate.

Independent review still requires scarce resources: reliable fixtures, execution time, observable traces, a qualified reviewer or evaluator, rollback rehearsal, and attention to evidence that may be missing, stale, correlated, or bound to the wrong subject. When proposal throughput rises faster than this capacity, the system accumulates a queue and then faces pressure to weaken gates.

That creates four common failure patterns:

- **scalar-score capture** — one attractive task score hides regressions in permissions, observability, lifecycle state, cost, or rollback;
- **quality-authority collapse** — an evaluator's confidence is treated as permission to mutate;
- **configured-but-unused verification** — a verifier exists in the architecture, but no subject-bound receipt proves it evaluated this candidate;
- **verification debt overflow** — the candidate queue grows until checks are rushed, waived, or performed by the proposing agent itself.

The core claim of this paper is narrow:

> A consequential agent system is solvent only when its rate of effectful commitment is bounded by the capacity of an independent verification path to produce fresh, subject-bound evidence at the required risk class.

Candidate generation may fan out. Reversible preparation may fan out. External or difficult-to-reverse effects may not outrun verification.

## 2. Definitions

**Candidate** — a proposed change to code, configuration, policy, memory, data, infrastructure, customer state, or a public surface.

**Quality delta vector** — a comparison between candidate and baseline across relevant system dimensions rather than a single aggregate score. A practical vector may include task outcome, execution isolation, tool behavior, context correctness, lifecycle/recovery, observability, verification, governance, latency, and cost.

**Blast radius** — the scope of possible harm or unintended effect: local and additive, local and mutating, wide but reversible, or hard to reverse.

**Reversibility** — the extent to which the prior state can be restored within a bounded time using a tested mechanism and intact evidence.

**Independent verification** — evidence produced by a role, oracle, or deterministic mechanism that does not merely repeat the candidate producer's assertion and whose provenance is inspectable.

**Verification work estimate, $w(c)$** — the expected independent work required to make candidate $c$ commit-eligible under its risk class. It can be represented in fixture runs, reviewer minutes, replay cost, or another locally calibrated unit. It is not model confidence.

**Available verification budget, $B_v(W)$** — verifier capacity available during window $W$ after reserving headroom for incidents, retries, and required rechecks.

**Verification insolvency** — a state in which admitted verification work exceeds bounded independent capacity, creating pressure to waive, collapse, or counterfeit checks.

## 3. Why existing controls are necessary but insufficient

### 3.1 Typed evidence

Typed artifacts make claims inspectable. A test receipt differs from a design argument; a trace differs from a model's confidence; a rollback rehearsal differs from a rollback plan. Typed evidence is a structural defense against silent and compositional failure.

But type correctness does not create capacity. Ten correctly typed evidence requests can still overwhelm one verifier.

### 3.2 Authority separation

The proposer should not hold ambient permission to approve its own consequential change. Separating proposal, verification, and effect authority limits self-authorization and correlated judgment.

But static role separation does not create backpressure. An authorized approver can still admit work faster than the verification path can evaluate it.

### 3.3 Evaluator confidence

LLM judges can be useful, but published work has documented position, verbosity, and self-enhancement biases. Research on intrinsic self-correction also shows that model critique without external feedback can fail or degrade reasoning. A score is therefore evidence about candidate quality under a specific evaluator contract—not mutation authority.

### 3.4 Tests and fixtures

A reproduced failure can be compiled into an executable fixture: the baseline must fail, the candidate must pass, and the existing suite must not regress. This converts prose memory into falsifiable proof debt.

But suites consume maintenance and execution capacity. A growing fixture corpus without admission budgeting can become stale, selectively skipped, or too slow to run at the rate candidates arrive.

## 4. The three-stage architecture

```text
candidate
   |
   v
[1] quality delta vector
    task | execution | tooling | context | lifecycle
    observability | verification | governance | cost | latency
   |
   v
[2] risk-scaled authority contract
    blast radius + reversibility + required evidence + rollback class
   |
   v
[3] verification-solvency admission
    reserve independent capacity -> verify -> commit / defer / narrow / shed
```

These stages should not collapse into one score.

### Stage 1 — Measure the vector

Hold the model, task set, base revision, permissions, and environment as fixed as the experiment allows. Compare the candidate with its baseline across each affected layer. Preserve regressions instead of averaging them away.

A candidate that gains two task points while losing permission containment is not “net positive.” It is a vector with a safety regression.

### Stage 2 — Convert risk into an evidence contract

The change's blast radius and reversibility determine what evidence is required. A local additive documentation edit may need deterministic validation and readback. A wide reversible change may require trajectory evidence, effect readback, and a rehearsed rollback. A hard-to-reverse effect may require a human gate or remain prohibited.

This stage answers: *What would be enough proof, and who may decide?*

### Stage 3 — Reserve verification capacity

Before a candidate becomes commit-eligible, reserve enough independent capacity to execute its evidence contract. During a bounded window $W$:

$$
\sum_{c \in A(W)} w(c) \leq B_v(W)
$$

where $A(W)$ is the set of candidates admitted into verification during that window.

Commit then requires a completed, subject-bound receipt:

$$
commit(c) \Rightarrow evidence\_complete(c) \land authority\_valid(c) \land rollback\_ready(c)
$$

The first equation creates backpressure. The second prevents reserved capacity from being mistaken for completed verification.

When capacity is exhausted, the system has only four honest actions:

- **defer** — keep the candidate queued without effect;
- **narrow** — reduce scope or commit granularity until the evidence contract is affordable;
- **shed** — discard low-value candidates;
- **escalate** — request additional qualified capacity without waiving the gate.

## 5. Falsifiable invariants

### Invariant 1 — Zero capacity means zero consequential commits

If fresh independent verification capacity for a risk class is zero, consequential commit admission for that class must also be zero.

**Falsifier:** a system sustains nonzero consequential commit throughput during a verified zero-capacity interval without accumulating unverified effects, correlated self-review, or hidden verification debt.

### Invariant 2 — Equal task scores may produce different decisions

Two candidates with the same aggregate task score but different cross-layer vectors must be eligible for different admission outcomes.

**Falsifier:** over a representative fixture set, the vector adds no decision information beyond the scalar score.

### Invariant 3 — Evaluator confidence never grants authority by itself

No confidence threshold may open a wider or harder-to-reverse effect unless deterministic requirements, risk classification, subject binding, and the appropriate authority contract are also satisfied.

**Falsifier:** a confidence-only gate matches or exceeds the risk-scaled gate on false accepts, false rejects, rollback readiness, and reviewer effort across held-out cases.

### Invariant 4 — Verification must bind to the candidate

A receipt is admissible only when it binds the candidate identity, baseline, evaluator or verifier version, fixture set, evidence outputs, and terminal decision.

**Falsifier:** unbound or stale receipts produce no additional false admissions in adversarial replay.

### Invariant 5 — Saturation must be visible and fail closed

Queue depth, estimated verification work, available budget, retry load, and hold reasons must be observable. Missing or unreachable verifier evidence cannot be replaced by producer self-certification.

**Falsifier:** hidden saturation never changes correctness, latency, rollback, or incident outcomes compared with explicit admission accounting.

### Invariant 6 — Reversibility claims require rehearsal

A rollback plan counts as evidence only after a bounded rehearsal or an equivalent deterministic proof on the relevant substrate.

**Falsifier:** unrehearsed rollback claims perform as reliably as rehearsed rollback in representative failures.

## 6. A worked synthetic result—and what it does not prove

Two source studies executed small deterministic toys relevant to this architecture.

One compared a confidence-only merge gate with a risk-and-evidence gate across six synthetic cases. The confidence-only baseline produced false accepts and a false reject; the risk/evidence gate matched all six fixture labels. Another prepared eight synthetic candidates in parallel and admitted only two after serial independent-evidence checks; six were held for self-certification, subject mismatch, failed status, unavailable evidence, missing evidence, or duplicate identity.

These results demonstrate **policy polarity**, not production efficacy. The fixtures were authored to expose the proposed failure modes. They do not establish real-world base rates, evaluator calibration, correct risk classification, economic benefit, or security. Their proper role is to show that the architecture can express decisions that scalar confidence and unbounded throughput cannot.

The strongest negative result is therefore important: **there is currently no production evidence that verification-solvency accounting reduces regressions or review time.** It may simply move bottlenecks into a more explicit queue. That would still improve legibility, but it would not prove better outcomes.

## 7. Smallest shadow experiment

A useful first test does not grant automatic merge authority.

1. Select 30–50 historical or synthetic candidate changes with independent human labels and explicit risk classes. The exact size should follow available cases and uncertainty, not a universal threshold.
2. Freeze candidate identity, baseline, task set, environment, evaluator version, and fixture hashes.
3. For each candidate, record:
   - scalar task or evaluator score;
   - cross-layer quality vector;
   - blast radius and reversibility class;
   - required evidence contract;
   - estimated verification work;
   - available budget at replay time;
   - human decision and after-action outcome, when available.
4. Compare three policies in shadow mode:
   - confidence-only;
   - typed evidence plus static authority;
   - three-stage verification-solvency admission.
5. Measure false accepts, false rejects, review time, queue age, abandoned candidates, rollback readiness, disagreement by risk class, and any case where the vector changed the decision.
6. Stop on any hard-safety false accept, unbound evidence, hidden credential handling, actor self-verification, or live external effect.
7. End with one decision: **keep, narrow, or delete** the mechanism.

The experiment succeeds only if the third policy changes important decisions or reduces unsafe admissions enough to justify its operational cost.

## 8. Threat model

The architecture assumes candidate producers may be competent but wrong, overconfident, correlated with their evaluator, or rewarded for throughput. It also assumes verifiers can drift, become unavailable, or be overloaded.

It is designed to resist:

- model confidence laundering;
- same-role self-certification;
- stale or wrong-subject receipts;
- scalar metrics hiding cross-layer regressions;
- queue pressure silently weakening gates;
- rollback claims without executable support;
- candidate floods that consume all reviewer attention.

It does not by itself solve:

- malicious operators with final authority;
- compromised verifier implementations;
- incorrect human labels;
- unknown blast-radius classes;
- collusion between proposer and reviewer;
- failures outside observable or modeled layers.

## 9. Design goals and non-goals

### Goals

- preserve cheap parallel exploration;
- prevent irreversible effects from outrunning independent evidence;
- make verifier saturation explicit;
- separate quality estimation from mutation authority;
- turn failures into reusable, subject-bound fixtures;
- force low-value candidate shedding rather than gate erosion.

### Non-goals

- maximizing raw agent output;
- proving that LLM judges are objective;
- creating a universal numeric verification currency;
- replacing human approval for high-risk effects;
- claiming a new autonomous self-improvement system;
- treating every documentation or local additive edit as equally expensive.

## 10. Implications for builders

1. **Instrument the queue before adding more agents.** Candidate throughput without verification demand and hold reasons is an incomplete metric.
2. **Store vectors, not vibes.** Preserve per-layer gains and regressions; do not average away a permission or recovery failure.
3. **Make risk policy separate code.** The evaluator estimates; the authority function decides what evidence the effect requires.
4. **Reserve before review, verify before commit.** Capacity reservation prevents overload; a completed subject-bound receipt prevents fictional verification.
5. **Shed aggressively.** Cheap generation makes low-value candidates abundant. Deletion is a safety and economics primitive.
6. **Rehearse rollback.** “Reversible” is a testable system property, not an adjective.
7. **Measure the mechanism's own cost.** If verification accounting produces chronic delay without decision improvement, narrow or remove it.

## 11. Current status and acceptance criteria

| Surface | Status |
|---|---|
| Cross-study mechanism | Synthesized |
| Public-source identity | Verified with stated caveats |
| Deterministic policy toys | Executed in source studies |
| Production implementation | Not implemented by this paper |
| Production efficacy | Unproven |
| Automatic merge authority | Not granted |

The mechanism should remain a design proposal until a shadow replay shows all of the following:

- at least one decision-changing cross-layer case;
- no hard-safety false accept;
- subject-bound receipts and explicit saturation behavior;
- measured review-time and queue-age impact;
- tested rollback evidence for reversible classes;
- a keep, narrow, or delete decision by an independent reviewer.

## 12. Evidence and references

1. Hanako, “eval engineering” article and local study of quality-versus-authority separation: <https://x.com/hanakoxbt/status/2083540339147567268>.
2. Junjie Li et al., *Agent Harness Engineering: A Survey*, companion project and catalog: <https://picrew.github.io/LLM-Harness/> and <https://github.com/Picrew/awesome-agent-harness>. The reviewed packet could not prove byte identity with the originally requested OpenReview record, so corpus counts and benchmark claims remain source-reported.
3. Lianmin Zheng et al., “Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena”: <https://arxiv.org/abs/2306.05685>.
4. Jie Huang et al., “Large Language Models Cannot Self-Correct Reasoning Yet”: <https://arxiv.org/abs/2310.01798>.
5. OpenAI, “Evaluation best practices”: <https://platform.openai.com/docs/guides/evaluation-best-practices>.
6. OpenAI, “Agent evals”: <https://platform.openai.com/docs/guides/agent-evals>.
7. U.S. House Select Subcommittee, *After Action Review of the COVID-19 Pandemic: The Lessons Learned and a Path Forward*: <https://oversight.house.gov/release/final-report-covid-select-concludes-2-year-investigation-issues-500-page-final-report-on-lessons-learned-and-the-path-forward/>. This paper transfers only the bounded control-loop analogy; it does not adopt the report's disputed scientific, political, legal, or causal conclusions.
8. Brain Dreamer design packet, generated through the configured Z.AI Coding Plan path with `glm-5.2` on August 2, 2026. The model proposed the “verification-bounded commit” novelty delta; the final paper was source-checked, corrected for dimensional consistency, expanded, and published by the Kurultai editorial workflow. This is provenance, not sole-model authorship.

## Conclusion

Typed evidence and separated authority answer two essential questions: *what proof exists* and *who may approve*. They do not answer a third: *can the system afford enough independent verification to understand this change before committing its effects?*

Verification solvency makes that question an admission-control invariant. It preserves parallel exploration while applying backpressure at the boundary where candidates become consequential. Its value is not that it makes agents autonomous. Its value is that it prevents growing proposal capacity from silently bankrupting the evidence system meant to keep autonomy bounded.

The architecture is plausible, falsifiable, and not yet production-proven. That is exactly the state a technical whitepaper should make visible.
