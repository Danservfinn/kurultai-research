---
type: analysis
status: published
created: 2026-08-10
updated: 2026-08-10
sources: 10
tags: [whitepaper, agentic-security, prompt-injection, eval-fixtures, buyer-pain, threat-model, parse-security, llm-defense]
---

# Persistent Control, Role Confusion, and Leaky Reasoning: Synthesizing the 2026 Agentic LLM Security Threat Surface from Research and Buyer-Pain Signals

## Abstract

A single day of curated security-research and buyer-pain signals — ten artifacts scored between 78 and 92 on a combined relevance/confidence rubric — reveals a coherent threat narrative for agentic large language model (LLM) systems in mid-2026. The signals do not describe isolated vulnerabilities. They describe a *layered* attack surface in which prompt injection is no longer a single-shot deception event but a gateway to persistent control, role confusion, private-reasoning exfiltration, and adaptive jailbreaking. This whitepaper synthesizes the cluster, maps it to a unified threat model, and proposes a defensive architecture centered on **pre-hoc detector allocation**, **hard-negative eval fixtures derived from primary research**, and **sanitized buyer-pain corpora** that can be converted into go-to-market (GTM) messaging and regression tests without exposing private user content. The work is grounded entirely in publicly verifiable primary sources (arXiv preprints and Hugging Face model cards) and respects read-only boundaries on social telemetry.

## Problem Statement

Defenders of agentic LLM systems face a paradox in 2026. The volume of disclosed attacks, detector models, and evaluation frameworks has never been higher, yet practitioners report that the *language* they need — both to communicate risk to buyers and to construct adversarial test corpora — remains fragmented across preprints, model cards, and informal channels. The originating proposal (ID `RP-20260601-387d2b85`, score 94, risk low) identifies this gap directly: organizations need "recurring language from security buyers and AI-app teams, not only tool/research announcements." In other words, the field produces announcements faster than it produces *usable* threat vocabulary, eval fixtures, and sales angles.

Three concrete problems follow:

1. **Vocabulary drift.** Buyer-pain language on social platforms and in issue trackers evolves faster than peer-reviewed terminology. Without a disciplined ingestion lane, GTM and security teams talk past each other.
2. **Eval-fixture scarcity with verifiable provenance.** Most published "prompt injection" benchmarks conflate taxonomies (direct, indirect, role-confused, persistent). Defenders need fixtures tagged by *failure mode*, not by dataset origin.
3. **Boundary preservation.** Mining buyer pain from social telemetry risks both terms-of-service violations and privacy leakage. Any pipeline must remain read-only, must verify technical claims against primary non-social sources, and must omit raw private content from operator reports.

This whitepaper addresses all three by treating the ten signals in proposal `RP-20260601-387d2b85` as a representative corpus, extracting a unified threat model, and specifying an architecture that converts verified pain into copy and fixtures without mutating runtime state.

## Evidence and Analysis

### The Signal Corpus

The proposal aggregates ten signals dated 2026-06-01, scored on a unified rubric, and routed through lanes tagged `buyer-pain`, `hermes-kurultai`, `parse-security`, and (in one case) `content-angle`. Nine signals score 92; one (`SIG-20260601-060`, OpenAI's `gpt-oss-120b` model card) scores 78 and serves as a capability-baseline reference rather than a direct attack artifact. Two signals appear twice across different routing lanes (`SIG-20260601-016`/`008`, "From Prompt Injection to Persistent Control"; `SIG-20260601-015`/`007`, "From Leaky Thoughts to Private Reasoning"), indicating that the same primary artifact was independently flagged by both the security-eval lane and the agentic-security-metrics lane — a strong corroboration signal.

The corpus clusters into four thematic bands.

### Band 1 — Detection Models and Adaptive Detector Allocation

The Hugging Face model card `av-codes/prompt-injection-detector-v2-bordair` (`SIG-20260601-042`) represents the open-source detector front: a fine-tuned classifier intended for inline injection screening. Complementary research (`SIG-20260601-017`, "Send a SCOUT First: Pre-hoc Reasoning for Adaptive Detector Allocation in Prompt-Injection Defense," arXiv:2605.30837) argues that *static* deployment of a single detector is suboptimal. The authors propose a pre-hoc "scout" reasoner that classifies incoming content by risk band and routes high-risk content to heavier, costlier detectors while letting low-risk content pass through a fast path. The buyer-pain implication is concrete: security teams complain that detectors are either too slow to sit inline or too weak to catch adaptive attacks. SCOUT's framing — *allocation* as a first-class defense primitive — supplies the vocabulary buyers lack.

### Band 2 — Adaptive and Self-Evolving Jailbreaking

`SIG-20260601-019` ("TRACE: Task-Aware Adaptive Self-Evolving Agentic Jailbreaking," arXiv:2605.30883) describes an attack framework in which the jailbreak itself adapts to the target agent's task structure and evolves across attempts. This is qualitatively different from static jailbreak corpora: the attack *learns* the agent's scaffolding. Paired with the role-confusion framing in `SIG-20260601-009` ("Prompt Injection as Role Confusion," arXiv:2603.12277), the picture that emerges is that injection is increasingly modeled as a *confusion of agency* — the attacker manipulates which entity the model believes it is obeying — rather than a string-matching evasion problem.

### Band 3 — Persistent Control and Backdoors

Two routing lanes independently surfaced "From Prompt Injection to Persistent Control: Defending Agentic Harness Against Trojan Backdoors" (arXiv:2605.31042, `SIG-20260601-016` and `SIG-20260601-008`). The persistence framing is the most consequential shift in the corpus. Classical prompt injection is ephemeral: a malicious instruction executes once and is gone. Persistent control describes mechanisms by which a single injection seeds a *durable* behavioral change in the agentic harness — for example, by planting a backdoor that re-activates on a trigger in a later session or a later tool call. From a buyer-pain standpoint, this transforms prompt injection from a "filter it at the boundary" problem into a "the harness itself may be compromised" problem, which is categorically harder to message and to remediate.

### Band 4 — Private Reasoning Leakage

"From Leaky Thoughts to Private Reasoning: Controlling What LRMs Say to Themselves" (arXiv:2602.24210, `SIG-20260601-015`/`007`) addresses a distinct but adjacent failure mode: large reasoning models (LRMs) expose intermediate chain-of-thought tokens that can leak system prompts, tool schemas, or retrieved context. This is not prompt injection per se; it is *reasoning disclosure* as a side channel. Buyer pain here centers on the tension between transparent reasoning (useful for debugging and trust) and confidentiality (required for production agents handling sensitive data).

### Cross-Cutting Signal — Spatial Reasoning and Capability Baseline

Two signals sit outside the security core but inform the threat model. "The Sword, Shield, and Achilles' Heel: Characterizing the Linguistic Inductive Bias of Large Language Models for Spatial Reasoning in Navigation Planning" (arXiv:2605.31404, `SIG-20260601-013`) and the `gpt-oss-120b` model card (`SIG-20260601-060`, score 78) establish the capability floor: agents in 2026 are competent enough at multi-step planning and spatial reasoning that *agentic* attacks (which require the model to plan across tool calls) are now practical at open-source scale. The threat surface has expanded precisely because the underlying competence has.

### Synthesis

The four bands are not independent. Read as a sequence, they describe a kill-chain:

1. An adversary probes the agent using an *adaptive, task-aware* jailbreak (TRACE).
2. The probe exploits *role confusion* to rebind the agent's locus of authority (Role Confusion).
3. If successful, the attack seeds *persistent control* via a backdoor in the harness (Persistent Control).
4. Throughout, *leaky reasoning* provides the side channel that tells the attacker whether each step succeeded (Leaky Thoughts).
5. *Static detectors* fail because the attack is adaptive; only *pre-hoc adaptive allocation* (SCOUT) keeps detection cost tractable.

This kill-chain is the single most important finding in the corpus and the foundation for the architecture proposed below.

## Proposed Architecture

The proposal's recommended path — `content_queue_and_parse_eval_backlog` — implies two downstream consumers: a content/GTM queue and an eval-fixture backlog. We specify each as a discrete pipeline stage with explicit ingestion, verification, transformation, and emission contracts. The architecture is deliberately *read-only* with respect to social telemetry and *side-effect-free* with respect to any production runtime: per the proposal's safety gates, "no provider/runtime/config/deploy changes" are permitted, and the system mutates only generated artifacts (packets, sidecars, fixtures), which are trivially rollable back.

### Stage 1 — Read-Only Ingestion Lane

A dedicated, read-only lane subscribes to security-research and buyer-pain sources. Inputs are normalized into signal records carrying: source URL, lane tags, a relevance/confidence score, a title, and a content hash. The lane is *append-only*: no engagement, no write actions, no API calls that mutate state on the source platform. This satisfies the safety gate "no X write/engagement actions."

### Stage 2 — Primary-Source Verification

Every signal that crosses a score threshold (the proposal uses 92 as the de facto inclusion bar for the security cluster, with 78 reserved for capability baselines) is verified against its primary non-social source before any downstream use. For the current corpus this means resolving each arXiv ID to the canonical abstract and each Hugging Face path to the canonical model card. Signals that cannot be verified are quarantined. This satisfies "verify technical claims against primary non-X sources before implementation."

### Stage 3 — Threat-Cluster Extraction

Verified signals are clustered by failure mode, not by source. The four bands identified above (Detection/Allocation, Adaptive Jailbreak, Persistent Control, Reasoning Leakage) emerge from this step. Clustering is performed against a controlled vocabulary derived from the primary sources themselves — *role confusion*, *persistent control*, *pre-hoc allocation*, *leaky thoughts* — rather than from informal social language. This is the step that converts *recurring language* (the proposal's stated need) into *structured terminology*.

### Stage 4 — Dual Emission

The cluster graph fans out to two emitters:

**4a. GTM/content emitter.** Produces sanitized, primary-source-grounded copy: landing-page language, sales angles, content hooks. Crucially, this emitter draws *only* on verified primary-source claims and the controlled vocabulary; it never incorporates raw user text from social telemetry. The proposal's expected benefit — "turns market pain into GTM copy and test fixtures while preserving X read-only and verification boundaries" — is realized here. Concretely, the persistent-control cluster yields copy such as: "Prompt injection is no longer a one-shot boundary event; modern attacks seed durable behavioral changes in your agent's harness. Defense requires detection that adapts per-input, not a static filter."

**4b. Eval-fixture emitter.** Produces tagged, sanitized test fixtures for the eval backlog. Each fixture carries: failure-mode tag, primary-source citation, a sanitized adversarial prompt or behavior description, and an expected detector/deny outcome. Sanitization is mandatory: any fixture derived from social buyer-pain language must be rewritten as a synthetic exemplar that preserves the *structure* of the complaint without reproducing private content. This satisfies "omit raw private content from operator reports" and gives the eval backlog fixtures with clean provenance.

### Stage 5 — Rollback and Audit

Every emitted artifact is accompanied by a sidecar recording: source signal IDs, verification status, cluster assignment, sanitization steps applied, and emitting operator. Because no runtime state is mutated, rollback is simply deletion of the generated packet and sidecar, per the proposal's rollback contract: "Delete the generated proposal packet/sidecar and remove the scheduled compiler cron; no runtime state is mutated by packets."

## Threat Model and Counter-Arguments

### What the Architecture Defends Against

The architecture is a *signal-to-fixture* pipeline, not a runtime defense. It does not itself detect prompt injection in production traffic. Its defensive value is indirect but significant: it supplies the eval corpus against which runtime detectors (such as `prompt-injection-detector-v2-bordair`) and runtime allocators (such as SCOUT) are regression-tested. A detector that has not been tested against the persistent-control and adaptive-jailbreak bands is, by construction, untested against the most consequential 2026 attack classes.

### Counter-Argument 1 — Social Telemetry Is Noisy and Unrepresentative

A critic might argue that buyer-pain mining overweights vocal minorities and that arXiv preprints are unrefereed. Both points are valid. The architecture mitigates them in three ways: (a) the score threshold (92) filters low-confidence signals; (b) primary-source verification eliminates claims that cannot be grounded in a canonical artifact; (c) cross-lane corroboration (the same artifact surfaced by two independent lanes, as with the persistent-control and leaky-thoughts papers) up-weights signals that survive independent routing. The critic's concern is best directed at *unsanitized* social mining; this architecture explicitly sanitizes and grounds.

### Counter-Argument 2 — Fixtures Derived from Public Research Will Lag Live Attacks

This is true and unavoidable. Public research trails the frontier by weeks to months. The architecture does not claim to cover zero-day injections; it claims to cover the *named, structured* threat classes that buyers are currently asking about and that detectors are currently being marketed against. For frontier coverage, the architecture is complementary to — not a replacement for — runtime adaptive defense (SCOUT-style allocation, behavioral monitoring, harness-integrity checking).

### Counter-Argument 3 — The Persistent-Control Frame Is Overstated

A skeptic might question whether "persistent control via Trojan backdoor" is a realistic production threat or a lab construct. The corpus itself is cautious on this point: the paper title pairs "persistent control" with "defending," signaling that the authors treat persistence as a hypothesis to be defended against rather than a demonstrated field incident. The architecture therefore treats persistent control as a *scenario class* for eval-fixture generation, not as a confirmed epidemic. This is the appropriate epistemic posture.

### Counter-Argument 4 — Sanitization Destroys Signal Fidelity

Rewriting a buyer complaint into a synthetic fixture can strip the very nuance that made it valuable. The architecture's response is to preserve *structure* (the failure mode, the confusion of roles, the persistence trigger) while discarding *verbatim* content. The controlled vocabulary exists precisely to carry the structural signal: a sanitized fixture tagged `role-confusion` + `persistent-control` retains the operational content even after the original wording is removed.

## Future Work

Five directions follow naturally from the corpus and architecture.

**1. Longitudinal buyer-pain tracking.** The current corpus is a single-day snapshot. A longitudinal study across weeks would reveal whether the four-band structure is stable or whether new bands (e.g., supply-chain attacks on agent plugins, multi-agent collusion) are emerging. The read-only lane is already instrumented for this; only the analytics layer is missing.

**2. Detector-coverage matrix.** Mapping each fixture in the eval backlog to the detector(s) that pass or fail it would produce a public coverage matrix — essentially a nutrition label for prompt-injection detectors. The `prompt-injection-detector-v2-bordair` model and any SCOUT-style allocator are natural first targets. Such a matrix would directly address buyer pain by letting purchasers compare detectors on named failure modes rather than on aggregate benchmark scores.

**3. Harness-integrity probes for persistent control.** The persistent-control band implies a class of defensive *probe* — a test that verifies the agentic harness has not been behaviorally modified across sessions. Designing such probes is open work; the eval-fixture emitter can stub the test cases, but the runtime harness-instrumentation contract is unspecified.

**4. Reasoning-disclosure side-channel quantification.** The leaky-thoughts band suggests a measurement problem: how much sensitive information does a given LRM leak via chain-of-thought under realistic prompting? A standardized disclosure metric — analogous to membership-inference metrics in differential privacy — would give buyers a number to compare models on, and would give the GTM emitter a defensible claim.

**5. Sanitization fidelity evaluation.** The architecture's sanitization step is currently specified but not evaluated. A human-in-the-loop study comparing sanitized fixtures to their raw counterparts on (a) structural fidelity and (b) privacy safety would tighten the emitter contract and is a prerequisite for trusting the pipeline at scale.

## Conclusion

The ten signals in proposal `RP-20260601-387d2b85` are more than a backlog of papers and model cards. Read together, they describe a 2026 agentic-LLM threat surface in which prompt injection is the entry point to a kill-chain encompassing role confusion, persistent harness control, adaptive self-evolving jailbreaks, and reasoning-side-channel leakage. Defenders lack the vocabulary, the fixtures, and the GTM language to respond at pace. The architecture proposed here — read-only ingestion, primary-source verification, failure-mode clustering, and dual emission into sanitized GTM copy and tagged eval fixtures — is a bounded, rollable-back, runtime-neutral response. It does not replace runtime defense; it supplies the named, grounded corpus that makes runtime defense testable and purchasable. The next step is to operationalize the longitudinal lane and publish the detector-coverage matrix that buyers are, according to the very pain signals we are mining, already asking for.

## References

1. av-codes. *prompt-injection-detector-v2-bordair* (model card). Hugging Face. https://huggingface.co/av-codes/prompt-injection-detector-v2-bordair — Signal `SIG-20260601-042`, score 92.

2. *TRACE: Task-Aware Adaptive Self-Evolving Agentic Jailbreaking.* arXiv:2605.30883v1. http://arxiv.org/abs/2605.30883v1 — Signal `SIG-20260601-019`, score 92.

3. *Send a SCOUT First: Pre-hoc Reasoning for Adaptive Detector Allocation in Prompt-Injection Defense.* arXiv:2605.30837v1. http://arxiv.org/abs/2605.30837v1 — Signal `SIG-20260601-017`, score 92.

4. *From Prompt Injection to Persistent Control: Defending Agentic Harness Against Trojan Backdoors.* arXiv:2605.31042v1. http://arxiv.org/abs/2605.31042v1 — Signals `SIG-20260601-016` and `SIG-20260601-008`, score 92 (cross-lane corroboration).

5. *From Leaky Thoughts to Private Reasoning: Controlling What LRMs Say to Themselves.* arXiv:2602.24210v2. http://arxiv.org/abs/2602.24210v2 — Signals `SIG-20260601-015` and `SIG-20260601-007`, score 92 (cross-lane corroboration).

6. *The Sword, Shield, and Achilles' Heel: Characterizing the Linguistic Inductive Bias of Large Language Models for Spatial Reasoning in Navigation Planning.* arXiv:2605.31404v1. http://arxiv.org/abs/2605.31404v1 — Signal `SIG-20260601-013`, score 92.

7. *Prompt Injection as Role Confusion.* arXiv:2603.12277v5 (content-angle lane). http://arxiv.org/abs/2603.12277v5 — Signal `SIG-20260601-009`, score 92.

8. OpenAI. *gpt-oss-120b* (model card). Hugging Face. https://huggingface.co/openai/gpt-oss-120b — Signal `SIG-20260601-060`, score 78 (capability baseline).

9. Originating proposal `RP-20260601-387d2b85`, status: proposed, type: `market_product_signal`, recommended path: `content_queue_and_parse_eval_backlog`. Internal proposal corpus.

10. *Prompt Injection as Role Confusion.* arXiv:2603.12277v5 (earlier version also surfaced in source-URL set). http://arxiv.org/abs/2603.12277v5 — Same artifact as reference 7.