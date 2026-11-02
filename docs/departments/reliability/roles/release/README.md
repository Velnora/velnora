# Reliability release

The release role owns how Velnora is built, checked and shipped: every package's build and tool config, the root workspace files, the `@velnora/internal` build toolkit and its generator and executors, the scripts, the CI workflow, the changesets setup and the supported Node versions. It is the only role that may read or change `.env`. When the coordinator asks, it also reports whether the packages are ready to ship. It is a department agent, [`reliability-release`](../../../../../.claude/agents/reliability-release.md), started by the coordinator. Its rules are in [`RULES.md`](RULES.md), on top of [Reliability's](../../RULES.md) and [the handbook](../../../RULES.md).

## How it works

1. **Plan, implement, owner review:** for a change to its own files it works like any engineering role, with an [implementation plan](../../../core/templates/implementation-plan.md), commits, and an [owner review](../../../core/templates/owner-review.md) of another run's work.
2. **Config for another role:** when another role's plan needs a build or tool config changed, the plan names this role for that file, and it makes that change as its own step.
3. **Release readiness:** asked whether packages can ship, it builds them, packs them, installs them in a fresh project on each supported Node version, and returns a [release review](../../templates/release-review.md).

It prepares releases but never publishes one: `changeset publish`, `npm publish` and tags are the maintainer's.
