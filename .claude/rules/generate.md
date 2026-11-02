---
paths:
  - "libs/internal/src/generators/**"
  - "libs/internal/generators.json"
---

# Generate Rules

- When asked to "generate" a new library, use this workspace's own `@velnora/internal:package` generator. Don't fall back to `@nx/js`, `@nx/plugin` or hand-rolled scaffolding: the local generator already encodes the workspace's package shape (the `@velnora/internal` Vite config, the `velnora.<name>` build output, `exports`, Biome lint, Vitest, `tsconfig` paths).
- Prefix with the workspace package manager, and look before writing: `yarn nx g @velnora/internal:package --name=<name> --directory=<path> --scope=<scope> --dry-run`, then again without `--dry-run`.
- `@velnora/internal` is a workspace package whose `main` points at its TypeScript source, so Nx loads the generator from `libs/internal/src/generators/package/` with no build step. Its contract is `schema.json` beside it; re-read that file when this rule and the schema disagree.
- For a plain-English explanation to give a developer, point them at [generating code](../../docs/05-development/02-generating-code.md) instead — see [docs.md](docs.md).

## `@velnora/internal:package`

- Options: `name` (required, without the `@velnora/` prefix), `directory` (required, relative to the workspace root, such as `libs/router`), `scope` (required, becomes the `scope:<scope>` Nx tag), `target` (`node` or `web`, default `node`, picks `defineNodeConfig` or `defineWebConfig`), `tags` (more Nx tags, comma-separated or repeated), `skipTests` (default `false`).
- What it creates: `package.json` (`@velnora/<name>`, `exports` pointing at `build/velnora.<name>.js` and `.d.ts`, `build`/`lint`/`test`/`typecheck` scripts, Node 24 or newer, public publish access), `project.json` (`type:lib` and `scope:<scope>` tags), `src/main.ts`, `vite.config.ts`, `tsconfig.json` (extends `tsconfig.base.json`) and, unless `skipTests`, `vitest.config.ts`. It also adds `@velnora/<name>` to `tsconfig.base.json`'s `paths`.
- After writing it calls Nx's `formatFiles`, then runs `yarn install` and `yarn prepare` (which builds every project). `formatFiles` doesn't run Biome, so run `yarn biome format --write <directory>` on the new package before committing.
- When a convention changes, fix the generator's templates under `files/` in the same change, so the next package comes out right instead of being patched by hand.
