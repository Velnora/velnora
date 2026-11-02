---
title: Testing
prev: "[[00-getting-started]]"
next: "[[02-generating-code]]"
covers:
  - vitest.config.ts
  - libs/*/vitest.config.ts
---

# Testing

Velnora tests with Vitest. Specs sit beside the code they test as `src/**/*.spec.ts` or `*.test.ts`, and each package has its own `vitest.config.ts` that includes just those files.

## Running them

- `yarn nx run @velnora/utils:test` runs one package's tests.
- `yarn nx run-many -t test` runs the `test` target of every package that has one.
- `yarn test` runs the root `vitest.config.ts`, which treats `libs/*` and `packages/*` as Vitest projects and always collects v8 coverage into `coverage/`.

## Where the tests are

Most of the tests are in `@velnora/types` and `@velnora/utils`. `cli`, `generator`, `cli-helper`, `host`, `kernel`, `runtime-node`, the `velnora` facade and `packages/cli` have a few each. The older generation has none.

## Gaps to know about

- The root projects glob only matches one level deep, so `yarn test` misses every nested package: `libs/unit/*`, `libs/helper/*`, `libs/runtime/*`, `libs/integrations/*` and `libs/vite/*`.
- `@velnora/kernel` and `@velnora/host` have specs but no `test` script, so Nx never runs them. `yarn vitest run --root libs/kernel` runs them by hand.
- A spec that imports another workspace package resolves it through that package's `build/` output, and no `test` target depends on `build`. On a fresh checkout ten of `@velnora/utils`' fifteen spec files and both kernel suites fail to load. Build the packages they import first, such as `yarn nx run @velnora/types:build`.
- The older packages declare a `test` script with no specs to run.

When you finish a change, record the exact test commands you ran and their results in the job's handoff, failures included; [the handoff rules](../../.claude/rules/handoffs.md) say how.

The next page, [generating code](02-generating-code.md), covers adding a package.
