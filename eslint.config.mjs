import * as tsEslint from "typescript-eslint";

import js from "@eslint/js";
import nxPlugin from "@nx/eslint-plugin";

export default [
  // Global ignores
  {
    name: "root-ignores",
    ignores: ["**/build/**", "**/node_modules/**", "**/dist/**"]
  },

  // Base JS config
  js.configs.recommended,

  // TypeScript (type-checked) for all .ts/.tsx
  ...tsEslint.configs.recommendedTypeChecked.map(cfg => ({
    ...cfg,
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      ...cfg.languageOptions,
      parserOptions: {
        ...cfg.languageOptions?.parserOptions,
        // Turn on the new TS Program service so we don't need per-project parserOptions.project globs
        projectService: true,
        allowDefaultProject: true,
        tsconfigRootDir: import.meta.dirname
      }
    }
  })),

  // Nx module boundaries (flat config style)
  {
    name: "nx-boundaries",
    plugins: { "@nx": nxPlugin, "@typescript-eslint": tsEslint.plugin },
    ignores: ["**/*.config.{mts,ts}"],
    rules: {
      "@nx/enforce-module-boundaries": [
        "error",
        {
          enforceBuildableLibDependency: true,
          // allowCircularSelfDependency: false,               // (optional, default false)
          // ignoredCircularDependencies: [],                  // (optional)
          // banTransitiveDependencies: false,                 // (optional)
          // checkNestedExternalImports: false,                // (optional)
          allow: ["^@velnora/cli(|/.*)$"], // (optional legacy allowlist)
          // buildTargets: ["build"],                          // (optional; for buildable checks)
          depConstraints: [
            // 1) Restrict usage of tooling to only development code
            {
              sourceTag: "dev:internal",
              notDependOnLibsWithTags: ["*"] // No production code can depend on tooling
            },

            // 2) Nobody can import from examples/services
            { sourceTag: "*", notDependOnLibsWithTags: ["type:example", "type:service"] },

            // 3) Examples can only depend on libs/integrations/cli
            { sourceTag: "type:example", onlyDependOnLibsWithTags: ["type:lib", "type:integration", "type:cli"] },

            // 4) Layering by scope
            {
              sourceTag: "scope:integrations",
              onlyDependOnLibsWithTags: [
                "scope:runtime",
                "scope:core",
                "scope:schemas",
                "scope:plugin-api",
                "scope:router"
              ]
            },
            {
              sourceTag: "scope:runtime",
              onlyDependOnLibsWithTags: ["scope:core", "scope:schemas", "scope:plugin-api"]
            },
            {
              sourceTag: "scope:vite",
              onlyDependOnLibsWithTags: ["scope:core", "scope:schemas", "scope:plugin-api", "scope:router"]
            },
            { sourceTag: "scope:rpc", onlyDependOnLibsWithTags: ["scope:core", "scope:plugin-api"] },
            { sourceTag: "scope:plugin-api", onlyDependOnLibsWithTags: ["scope:schemas"] },
            { sourceTag: "scope:schemas", onlyDependOnLibsWithTags: [] },
            { sourceTag: "scope:core", onlyDependOnLibsWithTags: ["scope:schemas", "scope:vite"] },

            // 5) Sides: client must not pull server bits
            { sourceTag: "side:client", notDependOnLibsWithTags: ["side:server"] },

            // 6) Engines stay isolated
            { sourceTag: "engine:react", notDependOnLibsWithTags: ["engine:vue", "engine:angular"] },
            { sourceTag: "engine:vue", notDependOnLibsWithTags: ["engine:react", "engine:angular"] },
            { sourceTag: "engine:angular", notDependOnLibsWithTags: ["engine:react", "engine:vue"] },

            // 7) CLI can’t pull browser/integration code
            {
              sourceTag: "type:cli",
              onlyDependOnLibsWithTags: [
                "scope:core",
                "scope:schemas",
                "scope:runtime",
                "scope:rpc",
                "scope:plugin-api",
                "scope:cli-helper"
              ],
              notDependOnLibsWithTags: ["side:client", "scope:integrations"]
            },

            // 8) Velnora main facade → may depend on runtime (client) and plugin-api, never server-side libs
            {
              sourceTag: "scope:velnora",
              onlyDependOnLibsWithTags: ["scope:plugin-api", "scope:runtime", "scope:integrations", "scope:schemas"],
              notDependOnLibsWithTags: ["side:server"]
            },

            // 9) Examples of using specific frameworks must only depend on the matching engine
            {
              sourceTag: "framework:react",
              onlyDependOnLibsWithTags: ["scope:velnora", "engine:react"]
            }
          ]
        }
      ],

      // Make sure we’re using the TS extension rule, not the core one
      "no-restricted-imports": "off",

      // ❌ value imports from @velnora/cli; ✅ type-only imports
      "@typescript-eslint/no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@velnora/cli",
              allowTypeImports: true,
              message:
                "@velnora/core may only import types from @velnora/cli. Use `import type { ... } from '@velnora/cli`."
            }
          ],
          patterns: [
            {
              group: ["@velnora/cli/*"],
              allowTypeImports: true,
              message: "@velnora/core may only import types from @velnora/cli/*."
            }
          ]
        }
      ],

      // Enforce writing `import type` for types
      "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }]
    }
  },

  // Project-wide stylistic rules (optional, adjust as you like)
  {
    name: "style",
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "no-console": "off"
    }
  }
];
