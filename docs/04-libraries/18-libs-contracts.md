---
title: "@velnora/contracts"
prev: "[[17-libs-plugin-api]]"
next: "[[19-libs-core]]"
covers:
  - libs/contracts
---

# @velnora/contracts

`@velnora/contracts`, at `libs/contracts/`, holds the Zod schemas for the older generation's config. It is the only place Velnora validates a config at runtime, and it validates a different, larger config than the one the Kernel reads today.

## What it exports

| Schema                   | Folder                  | Validates                                                                                                                                      |
| ------------------------ | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `velnoraConfigSchema`    | `src/core/velnora/`     | The workspace config: `mode` (default `development`), `root`, `apps`, `server`, `integrations`, `experiments`, `cacheDir` (default `.velnora`) |
| `velnoraAppConfigSchema` | `src/core/velnora-app/` | An app's config, with its `client` and `server` parts                                                                                          |
| `integrationSchema`      | `src/core/integration/` | One integration entry                                                                                                                          |

Missing objects are turned into `{}` before parsing by `nullishObject`, so every nested default applies. `apps-schema.ts` is the one file that doesn't follow the `*.schema.ts` naming.

## Good to know

[The Zod rules](../../.claude/rules/code-style/zod.md) say config schemas live here, under `src/core/<owner>/`. When the current generation's config gets runtime validation, it belongs here, replacing these shapes. It depends on `debug` and `zod`. It builds with tsup and its `typecheck` points at a missing `tsconfig.build.json`.

The older generation's logger is in [`@velnora/core`](19-libs-core.md), next.
