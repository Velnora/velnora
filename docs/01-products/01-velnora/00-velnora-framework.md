---
title: The Velnora framework
prev: "[[00-products]]"
next: "[[01-project-foundation]]"
covers:
  - libs/velnora
  - libs/cli
  - libs/helper/commands
---

# The Velnora framework

This page is Velnora from a developer's seat. It covers the package you install, the commands it gives you, and the config file you write. The mechanisms behind each command are in [the platform chapter](../../02-platform/00-platform.md); this page only says what you see.

## Installing it

The public package is `velnora`, at [`libs/velnora`](../../04-libraries/01-libs-velnora.md). It depends on `@velnora/cli` and ships a `velnora` binary that hands off to that package's binary. Inside this repository nothing is published yet: the [example workspace](../02-example-workspace/00-example-workspace.md) installs it as `"velnora": "workspace:^"`.

## The commands

Every command is declared once in [`@velnora/commands`](../../04-libraries/03-libs-helper-commands.md) and given its action in [`@velnora/cli`](../../04-libraries/02-libs-cli.md).

| Command              | What it does today                                                                                     |
| -------------------- | ------------------------------------------------------------------------------------------------------ |
| `velnora init <cwd>` | Creates `velnora.config.ts` and a private `package.json` with an empty `workspaces` list, if missing   |
| `velnora dev`        | Finds the workspace, discovers projects, configures units, picks an adapter and runtimes, then returns |
| `velnora build`      | Declared, with an empty action                                                                         |
| `velnora list`       | Declared, with an empty action                                                                         |
| `velnora graph`      | Declared, with an empty action                                                                         |
| `velnora doctor`     | Declared, with an empty action                                                                         |

`velnora dev` takes these options:

| Option          | Default       | Meaning                        |
| --------------- | ------------- | ------------------------------ |
| `--host`        | `localhost`   | Host to bind the dev server to |
| `--port`, `-p`  | `3000`        | Port to bind the dev server to |
| `--watch`, `-w` | `false`       | Watch mode                     |
| `--mode`        | `development` | `development` or `production`  |
| `--root`        | `.`           | Root directory of the project  |

The `host` and `port` defaults come from the Kernel and the Host, not from the command definition. Watch, mode and root are parsed but nothing reads them yet.

Since the HTTP listener is commented out, `velnora dev` logs the adapter it picked and the runtime it detected for each project, and the Kernel's boot then returns without serving anything. [The Kernel and Host](../../02-platform/02-kernel-and-host/00-kernel-and-host.md) explains why.

## The config file

A workspace is configured in one `velnora.config.ts`, `velnora.config.js` or `velnora.config.json` at its root, and each project may have its own next to its `package.json`. `velnora` exports `defineConfig` for the workspace file and `velnora/app` exports one for a project file, so both get type checking:

```ts
// velnora.config.ts at the workspace root
import { defineConfig } from "velnora";

export default defineConfig({
  integrations: []
});
```

The workspace file holds `integrations`, the units to load, and `resolve.units`, which maps one unit API name to another. A project file holds an optional `runtime` and `environments`. [Configuration](../../02-platform/01-workspace-discovery/01-configuration.md) covers how they are found and loaded. The `velnora/app` export points at a build file that the current build does not produce; [the `velnora` package page](../../04-libraries/01-libs-velnora.md) explains why.

Before the example workspace, the next page sets out [how the project is run](01-project-foundation.md): who decides what, and how work is split between the maintainer and the AI departments.
