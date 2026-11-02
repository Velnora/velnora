---
type: handoff
job:
tasks: []
role:
model:
date: "{{date:YYYY-MM-DD}}"
status:
branch:
pr:
---

# What this work did, in a few words

Open with a paragraph on what this work was asked to do and why, written so someone who has never seen it can follow. Link the issue it serves and the handoff it continues where the sentence mentions them, for example `for [#12](https://github.com/Velnora/velnora/issues/12), continuing [the analyst's brief](2026-11-02-product-analyst-adapter-selection.md)`. Work asked for straight in chat says so, with `tasks: []`.

## What I did and how

Tell what changed and how you went about it, in paragraphs: the approach, the libraries and files it touched, and anything non-obvious about how the pieces fit. Link the book pages you touched, such as `[the kernel](../../../02-platform/02-kernel-and-host/00-kernel-and-host.md)`.

## Why this way

Explain the decisions you made and the alternatives you considered, and why each alternative lost. This is the part a later session needs most, so it can build on your choices instead of reopening them.

## Checks

Say which checks you ran (lint, typecheck, tests, build, `docs:check`, a run of the example workspace) and what they showed. A check that failed stays here as a failure, with its output summarised. If something was not run, say so and why.

## Where it stands

Say whether the work is done, partial or blocked, what is committed and what is not, and every open question with the person it waits on.

## Next

Describe the exact next step for whoever continues, precise enough that they can start without asking.
