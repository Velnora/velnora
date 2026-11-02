# Implementation plan

What the owning engineer returns before any code is written: `core-engineer`, `ecosystem-integrations`, `ecosystem-tooling` or `reliability-release`. The analyst and the architect gate it.

```md
🤖 <Department> <role>: plan for <issue URL or "chat request"> <title>, attempt <n>

**Approach:** <two or three sentences: how the change meets the brief>

**Steps:**

1. <what changes, in which file, and why>

**Files and owners:**

| File     | Owner           | Change                   |
| -------- | --------------- | ------------------------ |
| `<path>` | `<dept>-<role>` | <new / edited / deleted> |

**Contracts touched:** <each export, unit kind, lifecycle step or config option that changes, and every package that consumes it, or "none">

**Tests:** <the specs that will cover each behaviour the change adds or changes>

**Checks to run:** <the exact `yarn nx ...` commands, and which of them already fail on `master`>

**Changeset:** <the packages and bump, or why none>

**Questions for the analyst, if any:**

1. <what the brief leaves open that the plan needs>
```
