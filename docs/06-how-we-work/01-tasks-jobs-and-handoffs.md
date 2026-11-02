---
title: Tasks, jobs and handoffs
prev: "[[00-how-we-work]]"
next: ""
covers:
  - docs/handoffs
  - docs/templates
  - .claude/rules/handoffs.md
---

# Tasks, jobs and handoffs

Agents forget everything between sessions, so every piece of work leaves a written record in the repository. The record has three kinds of note.

## The three notes

- A **task** is a GitHub issue. The repository keeps no copy of it; notes link it by its URL.
- A **job** is a lasting part of Velnora, such as the kernel's server startup. One job collects many tasks over its life. Its note, at `docs/handoffs/<area>/<job>/<job>.md`, says where the job stands now and how it got there.
- A **handoff** reports one piece of work by one role, at `docs/handoffs/<area>/<job>/<yyyy-mm-dd>-<role>-<topic>.md`. It says what was asked, what was done and why, which checks ran and what is next.

The area is the part of Velnora the job belongs to: `product`, `platform`, `devops`, `libraries`, `docs` or `departments`. New notes start from [the job template](../templates/job.md), [the handoff template](../templates/handoff.md) or [the compacted handoff template](../templates/compacted-handoff.md).

## How they are used

Before working on a job, read its note, then its handoffs from oldest to newest. Write your own handoff as you go and commit it with the work. A failed check stays in the handoff as a failure. Once its pull request has merged, a handoff is never rewritten; a later correction is a new handoff that links it. When a job collects more than ten merged handoffs, the next person to work on it folds the oldest ten into one compacted handoff. [The handoff rules](../../.claude/rules/handoffs.md) are the full contract.

That ends the book. [The front page](../velnora.md) is the way back in.
