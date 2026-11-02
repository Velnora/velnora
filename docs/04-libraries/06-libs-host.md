---
title: "@velnora/host"
prev: "[[05-libs-kernel]]"
next: "[[07-libs-utils]]"
covers:
  - libs/host
---

# @velnora/host

`@velnora/host`, at `libs/host/`, is the h3 server that served v0.1: every project's static files under its own path, plus a JSON index. Nothing imports it now, but it is the clearest description of what `velnora dev` should serve again. [The Kernel and Host](../02-platform/02-kernel-and-host/00-kernel-and-host.md#the-host) lists its routes.

## What it exports

`Host`, constructed with a list of projects and optional `DevCommandOptions`. It registers its routes in the constructor and has `listen()` and `close()`. Defaults are `localhost:3000`, merged with `defu`.

## Good to know

Files come from each project's `src/` folder through `resolveStaticFile`, with MIME types from a fixed table in `mime-type.ts`; both have specs. An HTML page gets a `<base href>` pointing at the project's path, so its relative assets load. It depends on `defu`, `h3` and `listhen`. Its targets are `build`, `lint` and `typecheck`, with no `test` script despite its specs.

The package the Kernel actually leans on is next, [`@velnora/utils`](07-libs-utils.md).
