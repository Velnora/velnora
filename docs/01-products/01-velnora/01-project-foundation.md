---
title: Project foundation
prev: "[[00-velnora-framework]]"
next: "[[00-example-workspace]]"
covers:
  - docs/departments
  - .claude/agents
  - CLAUDE.md
status: draft
updated: "2026-11-02"
---

# Project foundation

Velnora started as the user's personal hobby and is intended to mature into a complete developer product and, eventually, a company. The user holds the CEO role and has asked the assistant to take comprehensive day-to-day stewardship of the project with care. This page sets out how the project is run. Statements attributed to the user are confirmed context. The five departments and their roles were approved on 2026-11-02 and are installed as agents; the rest of the operating model is still a proposal for discussion.

## What we know

The user wants to explore the department idea on Velnora's own terms. Its responsibilities and roles may differ substantially from the reference concept. The user values clean structure, careful ownership, privacy, and an active companion who proposes the next step and carries independent work forward without requiring a new prompt for every small action.

The current [README](../../../README.md) describes a developer-oriented micro-app framework. The user's public articles establish a broader product intention: a meta-framework for systems that sits between application frameworks and infrastructure and manages Resolve → Build → Deploy → Run. The aim is to reduce the glue and infrastructure configuration developers maintain. This is the author's stated vision, not a claim that every lifecycle stage is implemented. See [Why Velnora?](https://medium.com/@veysaliyev00/why-velnora-2e8cdea1b04a), published on 2026-02-07.

The [Unit System article](https://medium.com/@veysaliyev00/one-array-to-rule-them-all-designing-velnoras-unit-system-1e8a0454bd5c) describes runtimes, adapters, and integrations entering through a common registration path with capability-based dependencies. The [runtime design article](https://medium.com/@veysaliyev00/basecontext-globalregistry-and-the-pause-before-the-runtime-6b5133be29c4) explains why foundational decisions warrant research: mistakes in runtime abstractions propagate to their consumers. These provide concrete context for ownership and review responsibilities.

Articles are dated design and implementation snapshots. Their [configuration update](https://medium.com/@veysaliyev00/configuration-system-overhaul-0709a80f2c2d) distinguishes completed configuration work from then-incomplete runtime execution. Present behavior must be verified in the repository. Earlier tracker references do not change the user's current choice of GitHub Projects. A first customer, commercial offering, revenue model, and release commitments remain unspecified; the product vision does not establish those choices by implication.

## Working purpose

The confirmed direction is to develop Velnora carefully from a personal project into a credible developer product, with an organization capable of supporting its eventual growth into a company. The assistant is expected to carry the project broadly rather than waiting for the user to select individual tasks or reserve particular implementation work for personal enjoyment. The user retains the ability to change direction and provide the fuller vision.

Engineering quality and creative freedom can coexist. Clean code and documentation help preserve the freedom to return to an idea, understand it, and change course deliberately. A prototype can be an explicit experiment, with a clear owner and an account of what it established. A permanent abstraction or organizational role should have a concrete reason to exist.

## Proposed collaboration model

The assistant should actively maintain the direction of the discussion, offer concrete proposals, identify consequences, and do useful work that does not depend on an unanswered question. It should distinguish the user's decisions from its own working assumptions and bring forward one consequential question at a time, with enough context to answer it naturally.

The assistant owns the follow-through across product proposals, technical planning, implementation, verification, documentation, and coordination within the authorized direction. It should discover and recommend the next useful work, keep a coherent plan, and explain consequential decisions. The user retains CEO authority and supplies the larger vision. Major strategic departures, external commitments, and materially irreversible decisions should be made explicit rather than inferred from broad day-to-day delegation. Routine choices should not repeatedly interrupt the conversation.

| Decision                                                                               | Proposed ownership                                                                        |
| -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Project purpose, creative direction, strategic priorities, and changes of course       | User                                                                                      |
| Exploration, product proposals, sequencing, and continuity                             | Assistant, with visible assumptions                                                       |
| Day-to-day delivery and implementation within the authorized direction                 | Assistant coordinates and owns follow-through; assigned owners follow the project's rules |
| Evaluation of meaningful technical risks                                               | A suitably independent review when the work needs it                                      |
| Public commitments, spending, release authority, merge authority, and sensitive access | To be settled explicitly before delegating those powers                                   |

These are proposed decision rights, not configured permissions. Tool use is governed by the [department rules](../../departments/RULES.md) and the `department-access` hook in [`.claude/settings.json`](../../../.claude/settings.json).

Broad stewardship includes selecting the next useful task within the established direction, resolving routine implementation choices, investigating failures, and carrying work through verification and reporting. Ending a step should produce a next action that the assistant can pursue within the active session. A status update or conversational acknowledgment does not create a new approval requirement. This does not imply unattended work continues after the session ends; background execution requires an actual supported mechanism.

When a choice would materially change product direction, discard valuable work, or create an external commitment, the assistant prepares the alternatives, recommendation, and consequences before bringing the decision to the CEO. Architectural uncertainty normally calls for research and a bounded experiment. It becomes a CEO decision when the tradeoff changes scope, compatibility promises, or strategic commitments. Existing merge ownership and access rules continue to apply.

## Careful stewardship

The proposed operating standard is to understand existing behavior and contracts before changing them, preserve valuable work, make coherent and reviewable changes, and verify the claims made about results. Technical debt and incomplete behavior stay visible. Experiments have an explicit purpose and an account of what they established; lasting abstractions need a demonstrated role in the product.

A useful first progression is to establish the vision and baseline, prove a coherent end-to-end product path, strengthen public contracts and delivery, and then add the company capabilities that actual users and the chosen business direction require. This is a proposed sequence rather than a release roadmap. It does not assume that hosting, a particular commercial model, or every planned department is required immediately.

The assistant should surface a concrete tradeoff with a recommendation when a decision genuinely needs the CEO. It should continue independent authorized work while that decision is open, and keep a durable record so the user does not have to repeat the context or prompt every transition.

## What organization must earn

Departments should give important work an owner, make useful checks independent, and prevent context from disappearing between sessions. A department may exist as a capability that is activated when needed; it does not need to occupy an agent slot continuously. The amount of ceremony should reflect the work, the product's maturity, and the value of the resulting accountability.

The roster below was approved on 2026-11-02 and is described in full in [the departments](../../departments/README.md). Its names, boundaries and models can still change as the work shows what each role is worth.

## Responsibility boundaries

Velnora has five departments organized around durable responsibilities. A department owns outcomes and knowledge; roles describe particular kinds of work inside it. Headcount, agent count, and department count need not match. The main companion session carries product coordination and continuity, while specialist roles are activated only when their contribution is useful and delegation is authorized.

| Department          | Accountable outcome                                                | Initial role responsibilities                                             |
| ------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| Product             | A coherent purpose, useful scope, and a reason for the next change | Product analysis, acceptance criteria, sequencing, delivery coordination  |
| Core platform       | Predictable engine behavior and stable extension contracts         | Kernel and lifecycle design, configuration, units, runtimes, architecture |
| Ecosystem           | A usable path from a real project into the platform                | Adapters, framework integrations, CLI, scaffolding, workspace tooling     |
| Reliability         | Evidence that changes work and can be delivered responsibly        | Independent QA, compatibility checks, security review, build and release  |
| Developer knowledge | An understandable product and durable, accurate project knowledge  | Book and API documentation, examples, onboarding, research records        |

Each department's roles are agent files under `.claude/agents/`, listed in [the departments](../../departments/README.md). Product analysis and product-fit review are one analyst role inside Product, rather than separate BA and PO roles, while one maintainer is the whole company. Architecture belongs with Core platform, with an independent review role for consequential changes. Security is an explicit Reliability specialty, engaged when trust boundaries warrant it. Agent policy and workflow maintenance remain coordination responsibilities until their volume justifies dedicated ownership. Commercial operations can be defined when the intended offering supplies concrete responsibilities.

Core platform owns the contracts that extensions consume. Ecosystem owns implementations of those contracts and brings evidence of missing capabilities back to Core platform. An integration must not solve a contract gap by depending on private engine internals. Reliability supplies independent evidence and release-readiness findings; the change author does not supply the only acceptance evidence for a meaningful risk. Developer knowledge documents verified behavior and marks design intent explicitly. A change still has one delivery owner accountable for its completion across these boundaries.

## Proposed work cycle

The companion maintains continuity from the user's direction, current repository evidence, and GitHub Projects. It identifies a concrete outcome, names the delivery owner, and states observable acceptance criteria. Research or a bounded experiment comes first when the next implementation would otherwise rely on an unverified assumption.

The owner produces a coherent change and the checks that demonstrate its behavior. Work touching public contracts, lifecycle ordering, execution, or security receives a review suited to that risk. A documentation correction can use a direct consistency check. Applicable checks need to pass, or their failures must be explained against a known baseline; neither a historical article nor code presence proves completion.

Review findings identify the failed contract, evidence, and required correction. The coordinator distinguishes missing information from an implementation defect and adjusts the work accordingly. Repeated failure of the same assumption triggers a revised approach and a visible blocker record, rather than an indefinite retry loop. CEO input is reserved for decisions that actually require CEO authority.

The result records what changed, verification, limitations, and the next useful action. Documentation and handoffs keep the next session able to continue. GitHub task state reflects actual progress under authorized tracker operations, and merge remains with the user under the repository's Git workflow. Separate roles must not introduce a mandatory sequence of approvals for every small edit.

## Testing the boundaries with real work

The following scenarios test the proposal; they do not authorize those engineering changes or external releases. Each has one delivery owner even when another department supplies review or supporting work.

| Work                         | Delivery owner      | Completion evidence and supporting responsibility                                             |
| ---------------------------- | ------------------- | --------------------------------------------------------------------------------------------- |
| Runtime execution change     | Core platform       | An adapter exercises the execution contract; Reliability checks failures and cleanup          |
| Framework integration        | Ecosystem           | A representative project exercises supported commands; Core reviews any contract extension    |
| Release preparation          | Reliability         | Supported toolchains build installable artifacts; owners resolve failures before readiness    |
| Product documentation repair | Developer knowledge | Claims match verified behavior and links resolve; affected owners resolve technical ambiguity |

For runtime work, Core platform owns the abstraction and implementation. Ecosystem supplies a real consumer to expose assumptions, and Reliability checks the behavior that could damage a running project: startup failure, execution failure, and cleanup. If an extension needs a new capability, its owner supplies the use case and proposed contract; Core decides the technical shape and documents the consequences. A change to product scope or a compatibility promise comes back through Product and, when needed, the CEO.

For integration work, Ecosystem owns the usable result rather than stopping at a registered plugin. The evidence should exercise a representative workspace through the commands the integration claims to support. An existing contract can be used directly. A missing contract triggers a focused Core contribution within the same delivery outcome, with explicit ownership for that contribution.

For release preparation, Reliability owns the readiness assessment and delivery tooling. Passing one package build is insufficient if the published artifact cannot be installed or the supported Node versions disagree. Known baseline failures remain visible and are evaluated for the release's scope. Readiness does not confer authority to merge, publish packages, announce a release, or make service commitments; those actions follow existing authorization and the CEO's eventual release policy.

For a documentation repair, Developer knowledge owns the correction and checks it against code or a verified behavioral example. Another owner is consulted only for an unresolved technical claim. This case should not acquire product, architecture, security, and QA approvals by default.

These cases support the five responsibility boundaries while revealing a cross-cutting need: each assignment must name a delivery owner, acceptance evidence, supporting contributors, and the reviewer required by its actual risks. Independent review means a separate assessment from the change's author. Until delegation is authorized and an actual reviewer is assigned, no independent-agent review is claimed. A failed review is resolved by evidence or revision; material unresolved disagreements return to coordination with the alternatives recorded.

## What is still open

The user has established the long-term ambition and broad project delegation, and their public writing supplies the systems-level product vision. The roster is in place. What each role actually earns will show once real work runs through it: a runtime execution change, a framework integration, a release, and a documentation correction. The decision rights above, a first customer, a commercial offering and a release policy are still open. The assistant leads this progression with concrete proposals and incorporates further CEO context as it arrives.

The discussion is recorded in the [project foundation job](../../handoffs/departments/project-foundation/project-foundation.md). GitHub Projects remains the task tracker, as [the GitHub Projects rule](../../../.claude/rules/github-projects.md) sets out.

With the people and roles settled, [the example workspace](../02-example-workspace/00-example-workspace.md) shows the framework running against a real monorepo.
