# Reliability

The reliability department supplies the evidence that a change works and can be shipped responsibly, independently of the role that wrote it. Its QA role runs the tests and the example workspace; its security role reviews changes that move a trust boundary; its release role owns the build, the CI and the release tooling that turn the code into installable packages. Readiness never includes the power to merge or publish: those stay with the maintainer.

How it fits with the other departments is in [the overview](../README.md). Its rules are in [`RULES.md`](RULES.md), on top of [the handbook](../RULES.md).

## Roles

| Role                                 | Model  | Does                                                                                                         |
| ------------------------------------ | ------ | ------------------------------------------------------------------------------------------------------------ |
| [qa](roles/qa/README.md)             | Sonnet | Runs the tests and the example workspace, writes failing specs for bugs and missing ones for changes         |
| [security](roles/security/README.md) | Opus   | Reviews request handling, user input, executed code, dependencies and what each package publishes            |
| [release](roles/release/README.md)   | Sonnet | Owns build and tool configs, `libs/internal`, CI, changesets and Node versions; the only role allowed `.env` |

## What it gets and gives

- **QA in:** the reviewed change, or a bug report. **Out:** a [QA report](templates/qa-report.md), and for a bug a failing spec committed first.
- **Security in:** the diff and the plan. **Out:** a [security review](templates/security-review.md).
- **Release in:** the brief or the approved plan for its own files, or another run's commits. **Out:** a [plan](../core/templates/implementation-plan.md), commits, an [owner review](../core/templates/owner-review.md), or a [release review](templates/release-review.md) of whether the packages can ship.

## Files

- [`reliability-knowledge.md`](reliability-knowledge.md): what the checks report on `master` today, and lessons from earlier runs.
- [`templates/`](templates): the QA report, the security review and the release review.
- [`roles/`](roles): how each role works.
