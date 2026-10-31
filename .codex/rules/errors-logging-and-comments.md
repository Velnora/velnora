---
description: "Apply when writing, reviewing, or refactoring error handling, logging, or code comments."
alwaysApply: true
globs: []
---

## Errors, Logging & Comments

- Never swallow errors silently. Never use an empty `catch {}`.
- Handle errors at the boundary where meaningful recovery, translation, logging, or presentation can occur.
- Fail explicitly instead of silently falling back.
- Logs should be structured and meaningful. Do not use `console.log` in application code.
- Default to no comments. Prefer clearer naming or extraction over explanatory inline comments.
- Never use inline `//` comments for narration or explanation. If an explanation must live in code, use rare JSDoc above the declaration for a hidden constraint, verified external-system quirk, or non-obvious invariant.
