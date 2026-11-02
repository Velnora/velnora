---
title: "@velnora/core"
prev: "[[18-libs-contracts]]"
next: "[[20-libs-integrations-react]]"
covers:
  - libs/core
---

# @velnora/core

`@velnora/core`, at `libs/core/`, was the older generation's home for its logger and small helpers. The server runtime imports `createLogger` from it. Despite the name, it is not the core of the current generation; that is [the Kernel](05-libs-kernel.md) and [`@velnora/utils`](07-libs-utils.md).

## What is in it

`src/main.ts` re-exports `./logger`, which no longer exists, so the package exports nothing that resolves. What is left is `src/utils/`, with `deepMerge`, a deep merge for plain objects that replaces arrays and primitives, and `isPlainObject`. A newer logger with specs lives in `@velnora/utils`, unexported.

## Good to know

It depends on `@velnora/types`, `lodash` and `picocolors`. Its `tsup.config.ts` calls `defineWebConfig` although the logger it once held ran in Node. It builds with tsup and its `typecheck` points at a missing `tsconfig.build.json`.

The integrations built on the older generation start with [`@velnora/integrations-react`](20-libs-integrations-react.md).
