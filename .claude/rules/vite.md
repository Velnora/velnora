---
paths:
  - "**/vite.config.ts"
  - "**/vitest.config.ts"
  - "**/tsup.config.ts"
  - "libs/internal/src/config/**"
  - "libs/internal/src/build.ts"
---

# Vite Config Rules

- Every library builds with Vite through `@velnora/internal`: a Node library calls `defineNodeConfig({ name })`, a browser library `defineWebConfig({ name })`, and passes anything project-specific (plugins, `test`, `resolve`) in the same object. Never hand-write the `build.lib`, `outDir` or `external` boilerplate those helpers already set.

  ```ts
  import { defineNodeConfig } from "@velnora/internal";

  export default defineNodeConfig({ name: "kernel" });
  ```

- The helpers (`libs/internal/src/config/define-base-config.ts`) build `src/main.ts` as an ES library into `build/`, emit one bundled `.d.ts` with `vite-plugin-dts`, resolve `tsconfig` paths, and keep every `@velnora/*` import external so packages never bundle each other.
- The output's basename comes from `getPkgName`: `name: "kernel"` becomes `velnora.kernel`, so the build writes `build/velnora.kernel.js` and `build/velnora.kernel.d.ts`. The package's `exports` must name exactly those files. Verify the output after building instead of assuming.
- Extra entries go in `build.lib.entry` as an object, and `buildEntries` prefixes each key with the package name: `cli`'s `build: { lib: { entry: { bin: "src/bin.ts" } } }` becomes `velnora.cli.bin`, next to the `velnora.cli` built from `src/main.ts`. The helpers read no other key for entries (an `entries` option is passed to Vite untouched and ignored), and never set `build.rollupOptions.input` or `build.rolldownOptions.input` to add one.
- Use `outDir: "build"`, never `dist`; the root `.gitignore` ignores `build/` in `libs/`, `packages/` and `examples/`.
- Package `build` scripts run `vite build --configLoader runner`, so the config can import `@velnora/internal` straight from its TypeScript source.
- Some libraries still build with tsup (`tsup.config.ts`). Don't add a new one: move a library to `defineNodeConfig`/`defineWebConfig` when its build is next touched, as its own change, and check its `exports` against the new output.
