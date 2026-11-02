---
title: Generating code
prev: "[[01-testing]]"
next: "[[03-code-quality]]"
covers:
  - libs/internal/generators.json
  - libs/internal/src/generators/package
---

# Generating code

Add a new package with the workspace's own Nx generator, `@velnora/internal:package`. It creates a package shaped like the current Vite-built generation, so don't copy an older package or use the stock Nx generators. Don't confuse it with [`@velnora/generator`](../04-libraries/11-libs-generator.md), which scaffolds a user's Velnora workspace.

## Running it

Look at a dry run first, then run it for real:

```bash
yarn nx g @velnora/internal:package --name=router --directory=libs/router --scope=router --dry-run
```

| Option      | Required | Meaning                                                               |
| ----------- | -------- | --------------------------------------------------------------------- |
| `name`      | yes      | The package name without `@velnora/`                                  |
| `directory` | yes      | Where it goes, relative to the workspace root                         |
| `scope`     | yes      | Becomes the `scope:<scope>` Nx tag                                    |
| `target`    | no       | `node` (the default) or `web`, picking the matching Vite build config |
| `tags`      | no       | More Nx tags                                                          |
| `skipTests` | no       | Leaves out `vitest.config.ts`                                         |

The schema beside the generator, [`schema.json`](../../libs/internal/src/generators/package/schema.json), is the exact contract.

## What you get

- `package.json` for `@velnora/<name>`, with `exports` pointing at `build/velnora.<name>.js` and its types, `build`, `lint`, `test` and `typecheck` scripts, and Node 24 or newer.
- `project.json` with `type:lib` and `scope:<scope>` tags.
- `src/main.ts`, `vite.config.ts`, `tsconfig.json` and, unless `skipTests`, `vitest.config.ts`.
- A `paths` entry for the package in `tsconfig.base.json`.

It then runs `yarn install` and `yarn prepare`, so expect the full build and its failures. Its formatting step is Nx's, not Biome's, so run `yarn biome format --write libs/router` on the new package before you commit.

## Changing it

When a package convention changes, change the generator's templates under `files/` in the same change, so the next package comes out right. [The generator rules](../../.claude/rules/generate.md) hold the details agents follow.

How the code is checked once it exists is next, in [code quality](03-code-quality.md).
