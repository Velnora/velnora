---

description: "Apply to every task in this repository."
alwaysApply: true
globs: []
---

## Core Principles

- Prefer clarity to compactness and maintainable code over clever code.
- Prefer explicit structure, ownership, and predictable behavior.
- Preserve existing behavior unless the task explicitly changes it.
- Keep changes scoped. Clean related duplication and obsolete code in the touched area, but avoid unrelated repository-wide rewrites.
- Do not preserve bad local patterns only because they already exist; move touched code toward the best proven local pattern.
- Before using a library, framework, runtime, generator, or tool, verify the installed version first, then check official docs/types/source for that version, then search the repository for existing usage.
- Never code against guessed library behavior or stale memory when the repository can be checked.
- Prefer non-deprecated APIs when the installed version marks an API deprecated.
- Optimize for reviewability, not for fewer files.
