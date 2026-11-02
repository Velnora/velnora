---
title: "@velnora/cli"
prev: "[[01-libs-velnora]]"
next: "[[03-libs-helper-commands]]"
covers:
  - libs/cli
---

# @velnora/cli

`@velnora/cli`, at `libs/cli/`, is where each command gets its action. It takes the commands declared in [`@velnora/commands`](03-libs-helper-commands.md), wires them to the Kernel and the generator, and parses the command line. It also ships the `velnora` binary that `velnora` hands off to.

## The actions

`src/main.ts` sets every command's action and then calls `program.parseAsync()`:

| Command                            | Action                                                                                                                                               |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `init`                             | `handleInit(cwd)`: calls `initWorkspace` from [`@velnora/generator`](11-libs-generator.md) and logs "Initialized workspace" or "Already initialized" |
| `dev`                              | `createKernel()`, then `init()` and `boot(options)` on it ([the Kernel](../02-platform/02-kernel-and-host/00-kernel-and-host.md))                    |
| `build`, `list`, `graph`, `doctor` | Empty                                                                                                                                                |

## The binary

`bin/velnora.js` imports `build/velnora.cli.bin.js`, built from `src/bin.ts`. In production, that file imports the built `velnora.cli.js`. Otherwise it runs `src/main.ts` from source through Vite and `vite-node`, with `tsconfig` paths and every `@velnora/*` package inlined, so the CLI runs against the workspace's TypeScript with no build. After the command returns, it closes Vite unless the command left handles open (a server, a watcher), in which case it closes Vite on exit, `SIGINT` or `SIGTERM`.

## Good to know

Its targets are `build`, `lint`, `test` and `typecheck`. `init` has a spec beside its handler. The source for `--host`, `--port` and the other options is the [commands package](03-libs-helper-commands.md), next.
