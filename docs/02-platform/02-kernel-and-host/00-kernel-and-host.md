---
title: The Kernel and Host
prev: "[[01-configuration]]"
next: "[[00-units]]"
covers:
  - libs/kernel
  - libs/host
---

# The Kernel and Host

The Kernel is the one object a `velnora dev` run revolves around. It finds the workspace, loads the units, picks who serves HTTP and who runs each project, and is meant to start the server and shut it down again. The Host is the h3 server the Kernel used to start before the unit system replaced it. This page covers the Kernel's lifecycle, the step it is missing, and what the Host did. What it can't do yet: serve anything. The listening code is commented out, so a run ends after picking runtimes.

## The lifecycle

[`@velnora/kernel`](../../04-libraries/05-libs-kernel.md) exports `createKernel()`, which returns a fresh `Kernel`. The CLI calls three methods in order.

`init()` runs [workspace discovery](../01-workspace-discovery/00-workspace-discovery.md). It finds the root, moves the process into it, and loads the root config and every project in parallel. It merges the config over the defaults (`{ integrations: [] }`) and hands it to `BaseContext`, so units can read `resolve.units`. Then it fills the unit graph. Every configured integration goes in, called with the `ConfigEnv` first if it is a function. The Node runtime is added if no runtime was configured, and the h3 adapter if no adapter was.

`boot(options)` throws "No projects discovered" when `init()` found none. Then it does three things:

1. It calls every unit's `configure()` in parallel, each with its own `BaseContext`, so units expose their APIs.
2. It takes the adapter units. It throws `NoAdapterProvidedException` if there are none. If there are several, it warns and uses the first. It queries that adapter's `http` API and stores it in the config registry.
3. For each project it filters the runtimes by `detect(project.root)`. It throws `NoRuntimeProvidedException` if none accept the project, warns if several do, and logs the first.

`shutdown()` closes the server if one is open and is safe to call twice. Since no server opens yet, it does nothing today.

## The missing step

After picking runtimes, `boot()` should take the registered `http` adapter, call `listen(port, host)` with the command's options (default `localhost:3000`), print the URL and the project list, and keep the server for `shutdown()`. That code sits in `kernel.ts` as a commented-out block. It is unfinished for two reasons. Nothing yet routes a request to a project through its runtime. And the h3 adapter's `use()` registers routes but nothing calls it. Wiring this step back in, with a route per project, is what makes v0.1 work again.

## The Host

[`@velnora/host`](../../04-libraries/06-libs-host.md) is an h3 server built around a list of projects. It mounts three kinds of route:

| Route               | Response                                                                                                                                               |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `GET /`             | JSON listing every project's `name`, `displayName` and `path`                                                                                          |
| `GET {path}/__json` | JSON with one project's `name`, `displayName`, `root` and `status: "registered"`                                                                       |
| `GET {path}/**`     | A file from the project's `src/` folder, `index.html` for the bare path. HTML gets a `<base href>` so relative assets resolve under the project's path |

It listens through `listhen` on `localhost:3000` unless `--host` or `--port` say otherwise. The old Kernel's `bootHost()` created one and listened, and the project's first spec for `velnora dev` printed `Host running at …` followed by one line per project. The current Kernel still lists `@velnora/host` as a dependency but never imports it. The Host stays as the reference for what the served result should look like until an adapter-based route per project replaces it.

## Why it is shaped this way

The Kernel depends on [`@velnora/commands`](../../04-libraries/03-libs-helper-commands.md) for `DevCommandOptions`, so a core package depends on a CLI-adjacent one. That was accepted to avoid duplicating the option types. The [Unit System article](https://medium.com/@veysaliyev00/one-array-to-rule-them-all-designing-velnoras-unit-system-1e8a0454bd5c) explains why runtimes, adapters and integrations enter through one `integrations` array rather than three config keys. The [runtime design article](https://medium.com/@veysaliyev00/basecontext-globalregistry-and-the-pause-before-the-runtime-6b5133be29c4) explains the pause before execution was wired: a wrong runtime abstraction spreads to every unit built on it.

How units plug in and find each other is the next page, [the unit system](../03-units/00-units.md).
