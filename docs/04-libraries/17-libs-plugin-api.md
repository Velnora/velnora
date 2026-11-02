---
title: "@velnora/plugin-api"
prev: "[[16-libs-router]]"
next: "[[18-libs-contracts]]"
covers:
  - libs/plugin-api
---

# @velnora/plugin-api

`@velnora/plugin-api`, at `libs/plugin-api/`, is the older generation's API for writing an integration. It is not the unit system: its `defineIntegration` has the same name as the one in [`@velnora/utils`](07-libs-utils.md) but makes a different object.

## What it exports

`defineIntegration` takes an integration object, or a function that returns one with optional options, and returns it unchanged for typing. The object's hooks are covered in [the server runtime](../02-platform/04-server-runtime/00-server-runtime.md#integrations-in-that-generation). `defineServerSetup` types an app's server setup function. It also exports `BaseMountOptions`, the options a client entry mounts with, and re-exports the `Integration` type from `@velnora/types`.

## Good to know

`src/types/` holds draft types for an app graph, plugin metadata, render hints, a resource registry and telemetry. Nothing imports them. `orderPlugins` in `src/utils/` isn't exported. It depends on `@velnora/types` and imports an `Integration` type that `@velnora/types` no longer exports. It builds with tsup and its `typecheck` points at a missing `tsconfig.build.json`.

The config those integrations read is validated by [`@velnora/contracts`](18-libs-contracts.md), next.
