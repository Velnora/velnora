---

description: "Apply when working on Zod schemas, inferred contract types, derived schema variants, or nestjs-zod DTO validation; confirm Zod usage from imports or dependencies."
alwaysApply: false
globs: ["**/*.schema.ts","**/_.schema.mts","**/_.schema.cts"]
---

## Zod

- A `*.schema.ts` file may keep a schema together with its directly inferred `z.infer` type and meaningful derived variants from that schema.
- Schema files must not contain unrelated functions, classes, enums, constants, or trivial duplicate aliases.
- This is an explicit exception to one-file-one-entity because the schema and its inferred type represent the same contract.
