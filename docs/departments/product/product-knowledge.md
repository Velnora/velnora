# Product knowledge

Facts and lessons for the coordinator and the analyst. Not rules: the rules are in [`RULES.md`](RULES.md) and [`.claude/rules/`](../../../.claude/rules).

## Facts

- Velnora is a public framework for running many apps in one workspace. What it does today and what its first milestone lacks are in [the products chapter](../../01-products/00-products.md).
- `velnora dev` finds the workspace's projects and picks a runtime for each, but doesn't serve anything yet: the kernel's listen step is commented out. [The kernel and host](../../02-platform/02-kernel-and-host/00-kernel-and-host.md) page has the detail.
- Two generations of packages live side by side, as [the platform chapter](../../02-platform/00-platform.md) explains. Work on the older one needs the maintainer's say on whether it is being revived or replaced.
- Tasks are issues in [`Velnora/velnora`](https://github.com/Velnora/velnora/issues) on [project board 4](https://github.com/orgs/Velnora/projects/4). Read the board's real fields with `gh project field-list 4 --owner Velnora` before using one.
- The maintainer writes public design articles. They are dated snapshots of intent: useful for direction, never evidence of what the code does now.

## Lessons

None yet.
