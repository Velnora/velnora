---

description: "Apply when writing, reviewing, or refactoring functions, control flow, and side effects."
alwaysApply: true
globs: []
---

## Functions, Control Flow & Side Effects

- Avoid god classes, god services, deeply nested condition trees, nested ternaries, giant inline ternaries, giant one-line objects, and giant one-line conditions.
- Avoid premature abstractions, generic engines, reflection-heavy meta-programming, and magic auto-registration unless repeated concrete need proves they are justified.
- Prefer guard clauses when they improve readability. Guard clauses must use braces.
- Object literals with more than three properties should be multiline.
- Do not hide expensive I/O, network calls, storage operations, native bridge calls, or other significant side effects behind getters or seemingly pure helpers.
