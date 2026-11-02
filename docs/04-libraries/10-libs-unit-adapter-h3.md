---
title: "@velnora/adapter-h3"
prev: "[[09-libs-unit-runtime-node]]"
next: "[[11-libs-generator]]"
covers:
  - libs/unit/adapter/h3
---

# @velnora/adapter-h3

`@velnora/adapter-h3`, at `libs/unit/adapter/h3/`, is the HTTP adapter unit over [h3](https://h3.dev). Its default export, made with `defineAdapter`, is the adapter the Kernel adds when the config names none, and the one whose `http` API the Kernel records at boot.

## What it does

`configure(ctx)` creates an `H3` app and exposes an `HttpAdapter` as both `http` and `h3`:

| Method                | Behaviour                                                                                         |
| --------------------- | ------------------------------------------------------------------------------------------------- |
| `use(route, handler)` | Mounts a Node-style `(req, res)` handler on every method of `route`; other call forms are ignored |
| `listen(port, host)`  | Starts the app through `listhen`, without printing a URL, and returns the Node `Server`           |
| `close()`             | Closes that server                                                                                |

Its `dev()` and `build()` hooks are empty.

## Good to know

Nothing calls `use()` or `listen()` yet, since the Kernel's listening step is commented out ([the missing step](../02-platform/02-kernel-and-host/00-kernel-and-host.md#the-missing-step)). It imports `defineAdapter` from `@velnora/utils` without listing it as a dependency. Its targets are `build`, `lint`, `test` and `typecheck`.

The package behind `velnora init` is next, [`@velnora/generator`](11-libs-generator.md).
