---
title: The unit system
prev: "[[00-kernel-and-host]]"
next: "[[00-server-runtime]]"
covers:
  - libs/utils/src/unit
  - libs/utils/src/core
  - libs/types/src/unit
  - libs/kernel/src/helper
  - libs/unit
---

# The unit system

A unit is anything that plugs into Velnora. A runtime knows how to run a kind of project, an adapter serves HTTP, and an integration adds a framework or a feature. All three enter the same way, through the workspace config's `integrations` array, and find each other by name through a shared registry rather than by importing each other. This page covers how a unit is defined, how units depend on and talk to each other, and the two units Velnora ships. What it can't do yet: units are configured but never asked to do their real work. No runtime runs a project, no adapter listens, and no integration unit exists yet.

## Defining a unit

[`@velnora/utils`](../../04-libraries/07-libs-utils.md) exports `defineRuntime`, `defineAdapter` and `defineIntegration`, all made by `defineUnit(kind)`. Each takes a unit object, or a function of `ConfigEnv` that returns one, and stamps it with its `kind`: `runtime`, `adapter` or `integration`, the `UnitKind` enum in [`@velnora/types`](../../04-libraries/08-libs-types.md). A unit has:

| Field          | Holds                                                                   |
| -------------- | ----------------------------------------------------------------------- |
| `name`         | Its unique key in the unit graph, such as `node` or `h3`                |
| `version`      | Usually its package's version                                           |
| `capabilities` | The API names it provides, such as `["http", "h3"]`                     |
| `required`     | Unit names it can't work without                                        |
| `optional`     | Unit names it uses when present                                         |
| `units`        | Further units it brings with it                                         |
| `configure`    | Called once at boot with its context; this is where it exposes its APIs |

A runtime adds `runtime`, `detect(cwd)`, `resolve(ctx)` and `resolvePackageManager(cwd)`. An adapter adds `dev(project, ctx)` and `build(project, ctx)`, and an integration may add `build(ctx)`. The Kernel does not read `units` yet. The types for compiling, executing and testing a project already exist in `@velnora/types`, and the runtime's matching methods are commented out.

## Typed APIs through `Velnora.UnitRegistry`

Units never import each other. A unit exposes an API under a name, and another unit queries that name. The names and their types live in one global interface, `Velnora.UnitRegistry`, which each unit package extends in its own `velnora-env.d.ts`. The h3 adapter adds `http` and `h3` as its `HttpAdapter`. The Node runtime adds `node` and `javascript` as its `JavaScriptRuntime`. Installing a unit's package therefore makes `ctx.query("http")` return the right type everywhere, with nothing to import.

## The context

The Kernel's `BaseContext` gives each unit one context, created by `BaseContext.for(unit)` and reused after that. It has two methods.

`expose()` publishes an API, as `expose("http", adapter)` or `expose({ http: adapter, h3: adapter })`. Values land in a global registry. `BaseContext.batch()` queues exposes made inside it and writes them all at the end, so a group of units can't see each other's half-finished state.

`query()` reads one API, or several given an array of names. Before reading, it resolves the name in two steps. First come aliases that units registered themselves. Then come the workspace config's `resolve.units`, so `{ resolve: { units: { http: "fastify" } } }` would point every `http` query at whatever exposed `fastify`. A cycle stops the resolution with one warning. An alias that resolves to nothing warns once and falls back to the original name.

## The graph and the registry

The Kernel keeps units in a `DepGraph` from `@velnora/utils`, keyed by `name` with `required` and `optional` as edges. The graph supports `add`, `link`, `has`, `find`, `filter` (sync or async), `map`, `forEach` and `toArray`. `filter` returns a new graph that keeps the edges between surviving nodes.

The registry is `GlobalRegistry`, a namespaced `Map` stored on `globalThis`. Two copies of `@velnora/utils` loaded by different bundles still share one registry. The namespaces (`config`, `units`, `context`) are the constants `CONFIG_REGISTRY`, `UNITS_REGISTRY` and `CONTEXT_REGISTRY`.

## The units Velnora ships

[`@velnora/runtime-node`](../../04-libraries/09-libs-unit-runtime-node.md) is the default runtime. It accepts a project that has a `package.json` whose `engines.node` is missing or matches the running Node version. It resolves the Node binary and version, and finds an npm package manager when a `package-lock.json` exists. It exposes a `JavaScriptRuntime` whose `run(file)` is an empty stub.

[`@velnora/adapter-h3`](../../04-libraries/10-libs-unit-adapter-h3.md) is the default adapter. It exposes an `HttpAdapter` over h3. `use(route, handler)` mounts a Node-style handler on every method of a route. `listen(port, host)` starts it through `listhen` and returns the Node server. `close()` stops it. Its `dev()` and `build()` are empty.

The older generation built its own, separate integration API, with React and Nest integrations on top of it. [The server runtime](../04-server-runtime/00-server-runtime.md) describes it.
