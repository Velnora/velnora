---
paths:
  - "**/*.schema.ts"
  - "**/*-schema.ts"
  - "libs/contracts/**/*.ts"
---

# Zod Rules

- A `*.schema.ts` file may keep a schema together with its directly inferred `z.infer` type and meaningful derived variants from that schema.
- Schema files must not contain unrelated functions, classes, enums, constants, or trivial duplicate aliases.
- This is an explicit exception to one-file-one-entity because the schema and its inferred type represent the same contract.
- The schemas for Velnora's configuration (`velnora.config.*`, an app's config, an integration's options) live in `@velnora/contracts`, under `src/core/<owner>/`, and every other library reads the parsed result through its exported types. Don't define a second schema for the same contract elsewhere.
- Name schema files `<concept>.schema.ts`. `apps-schema.ts` is the one older file that doesn't follow it yet; rename it when its contract next changes.
