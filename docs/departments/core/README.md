# Core platform

The core platform department owns the engine: the kernel and its lifecycle, configuration, the unit system, runtimes, and the types and contracts every extension builds on. Its engineer builds it, its architect checks every plan before code is written, and its reviewer checks every change before QA. The maintainer owns the architecture itself; the department applies the shape the code and the book already set, and brings anything new to the maintainer.

How it fits with the other departments is in [the overview](../README.md). Its rules are in [`RULES.md`](RULES.md), on top of [the handbook](../RULES.md).

## Roles

| Role                                   | Model  | Does                                                                                    |
| -------------------------------------- | ------ | --------------------------------------------------------------------------------------- |
| [architect](roles/architect/README.md) | Opus   | The technical half of the gate: approves, rejects or asks the maintainer, and sizes it  |
| [reviewer](roles/reviewer/README.md)   | Opus   | Reviews every change, from any department, against its plan and the rules; and rule PRs |
| [engineer](roles/engineer/README.md)   | Sonnet | Plans, implements and owner-reviews the engine packages, with their unit tests          |

## What it gets and gives

- **Architect in:** the brief and the owning engineer's plan. **Out:** a [technical gate verdict](templates/technical-gate-verdict.md).
- **Reviewer in:** the brief, the gate verdicts, the diff and its commits, and the owner reviews. **Out:** a [change review](templates/change-review.md), or a [rule review](templates/rule-review.md) for a rule change.
- **Engineer in:** the brief for its plan, the approved plan for its implementation. **Out:** an [implementation plan](templates/implementation-plan.md), then commits, and later an [owner review](templates/owner-review.md) of another run's work.

The plan and owner review templates here are shared by every engineering role, in Ecosystem and Reliability too.

## Files

- [`core-knowledge.md`](core-knowledge.md): the engine's shape and lessons from earlier gates and reviews.
- [`templates/`](templates): the plan, the gate verdict, the owner review, the change review and the rule review.
- [`roles/`](roles): how each role works.
