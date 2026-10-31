---
description: "Apply to code organization, ownership, naming, and refactoring in every coding task."
alwaysApply: true
globs: []
---

## Structure & Ownership

- One file should have one clear responsibility.
- Prefer one file = one entity. If a second meaningful entity is needed, move it into its own file unless a documented technology-specific exception applies.
- One function = one purpose. One class/service = one responsibility.
- Prefer standalone functions for pure logic. Do not create classes only to group helper functions.
- Extracted named helper functions follow the same one-file-one-entity rule. When logic is pulled out of a main function into its own named helper, move that helper into its own file and import it; do not define the extracted helper alongside the main function it supports.
- Organize source code as a tree by the strongest ownership axis: domain, feature, runtime, layer, responsibility, provider, adapter, integration, module, protocol, transport, or platform.
- Keep source roots minimal and intentional. New features should extend the tree instead of polluting the root.
- Shared code must be promoted deliberately behind an explicit stable boundary. Do not reach into another module/package/app's internals.
- Avoid circular dependencies and hidden cross-module coupling.
- Do not create dumping-ground files or folders.
- Use descriptive domain-specific names. Avoid vague names such as `helper`, `utils`, `manager`, `processor`, `common`, `misc`, or `doStuff` when a precise name is available.
- Refactor the touched scope when a file becomes multi-purpose, a function becomes too large, responsibilities become mixed, unsafe casts appear, duplicated mapping appears, or unstable cross-module imports grow.
