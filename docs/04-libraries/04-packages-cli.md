---
title: "@velnora/cli-helper"
prev: "[[03-libs-helper-commands]]"
next: "[[05-libs-kernel]]"
covers:
  - packages/cli
---

# @velnora/cli-helper

`@velnora/cli-helper`, at `packages/cli/`, is a small typed command builder over yargs. It is the only package under `packages/`. It turns option and positional strings into both yargs definitions and TypeScript types, so a command's handler is typed from the same string that defines its flags.

## Using it

```ts
import { Program } from "@velnora/cli-helper";

const program = Program.createProgram();
program.name("velnora").description("Velnora CLI").version("0.1.0");

const dev = program
  .command("dev")
  .option("--port <number>, -p", { description: "Port", default: 3000 })
  .option("--watch, -w", { description: "Watch mode", default: false });

dev.action(options => {
  // options.port: number, options.watch: boolean
});

await program.parseAsync();
```

A `Program` has `name`, `description`, `version`, `command`, a global `option`, `parse`, `parseAsync` and `overrideExit`. A `Command` has `option`, `positional`, `addAlias`, `removeAlias`, `description`, `validate` and `action`. `inferCommandType<typeof command>` gives the parsed options type, which [`@velnora/commands`](03-libs-helper-commands.md) uses for `DevCommandOptions`.

## Good to know

The type-level parser is the bulk of the package, over thirty small types under `src/types/` that split the spec into its name, aliases, value kind (`string`, `number`, a `|` union) and whether it is variadic. `parse-spec` and `parse-positional` do the same at runtime and have specs. It builds with Vite, but its `typecheck` points at a `tsconfig.build.json` it doesn't have.

With the command line covered, the next package is the one it hands control to, [`@velnora/kernel`](05-libs-kernel.md).
