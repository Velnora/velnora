# Reliability knowledge

Facts and lessons for QA, security and release. Not rules: the rules are in [`RULES.md`](RULES.md) and [`.claude/rules/`](../../../.claude/rules).

## Facts

- The root `yarn test` treats only `libs/*` and `packages/*` as Vitest projects, so it misses every nested package. `@velnora/kernel` and `@velnora/host` have specs but no `test` script. [Testing](../../05-development/01-testing.md) has the detail.
- Specs that import another workspace package need it built first: no `test` target depends on `build`. On a fresh checkout `@velnora/types` passes 816 tests, while ten of `@velnora/utils`' spec files fail to load and one of its tests fails on Windows.
- `yarn typecheck` fails in every package today, and the current generation's typecheck writes `.js` files beside the sources.
- `yarn lint:all` reports 57 errors in existing code.
- The only workflow, `next-release.yml`, runs on pushes to `master` with Node 20, while the packages need Node 24. It runs no lint, test or typecheck, and nothing runs on pull requests. [CI and release](../../03-devops/02-ci-and-release/00-ci-and-release.md) has the detail.
- Changesets are in pre mode with the `dev` tag. Publishing is the maintainer's.
- Velnora has no `.env` file and no `.env.example`.
- `@velnora/rpc` and the server runtime are where request handling and calls between apps will live; both are placeholders or older-generation code today.

## Lessons

None yet.
