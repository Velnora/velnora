# Core platform knowledge

Facts and lessons for the architect, the reviewer and the engineer. Not rules: the rules are in [`RULES.md`](RULES.md) and [`.claude/rules/`](../../../.claude/rules).

## Facts

- The current generation runs `velnora dev` from TypeScript source through Vite: the CLI hands off to the kernel, which finds the workspace, builds the unit graph and picks a runtime per project. [The platform chapter](../../02-platform/00-platform.md) has the seven steps.
- Units are runtimes, adapters and integrations. Each declares what it exposes and what it needs, and the kernel orders them with a dependency graph. [Units](../../02-platform/03-units/00-units.md) has the detail, including the `Velnora.UnitRegistry` global type.
- The kernel's listen step is commented out, so nothing serves yet. `@velnora/host` serves static files but nothing uses it.
- `@velnora/kernel` imports `@velnora/runtime-node` and `@velnora/adapter-h3` without listing them as dependencies, as [the libraries chapter](../../04-libraries/00-libraries.md) records.
- The kernel's specs import packages through their `build/` output, so they fail to load until `@velnora/types` and `@velnora/adapter-h3` are built.
- Typechecking fails in every package today, and the current generation's typecheck writes `.js` files beside the sources. [`STATUS.md`](../../../STATUS.md) has the list.

## Lessons

None yet.
