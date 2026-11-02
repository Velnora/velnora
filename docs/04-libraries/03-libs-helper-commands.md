---
title: "@velnora/commands"
prev: "[[02-libs-cli]]"
next: "[[04-packages-cli]]"
covers:
  - libs/helper/commands
---

# @velnora/commands

`@velnora/commands`, at `libs/helper/commands/`, declares the `velnora` program and every command with its options, without any behaviour. Keeping the declarations apart lets the Kernel and the Host import `DevCommandOptions` without importing the CLI.

## What it exports

| Export                                                         | What it is                                                             |
| -------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `program`                                                      | The `velnora` program, version `0.1.0`                                 |
| `initCommand`                                                  | `init <cwd>`                                                           |
| `devCommand`                                                   | `dev` with `--host`, `--port`/`-p`, `--watch`/`-w`, `--mode`, `--root` |
| `buildCommand`, `listCommand`, `graphCommand`, `doctorCommand` | Declared with a description and no options                             |
| `DevCommandOptions`                                            | The `dev` options type, with `host` and `port` required                |

The option types are inferred from the option strings themselves, such as `"--port <number>, -p"`, by [`@velnora/cli-helper`](04-packages-cli.md). Changing a string changes the type. [The framework page](../01-products/01-velnora/00-velnora-framework.md) lists the defaults.

## Good to know

Its targets are `build`, `lint`, `test` and `typecheck`, and it has a spec at `src/main.spec.ts`. The builder it uses is next, [`@velnora/cli-helper`](04-packages-cli.md).
