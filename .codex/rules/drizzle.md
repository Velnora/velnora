---
description: "Apply when working on Drizzle ORM tables, inferred persistence types, relations, enums, reusable columns, or Drizzle configuration; confirm Drizzle usage from imports or dependencies."
alwaysApply: false
globs: ["**/drizzle.config.*"]
---

## Drizzle

- A Drizzle table file owns one persistence entity.
- The table and its directly inferred `$inferSelect` / `$inferInsert` types stay in the same file; treat them as one persistence entity.
- Do not create separate files only for directly inferred select/insert aliases.
- Separate enum definitions, relation definitions, or reusable column builders only when they have their own meaningful responsibility.
