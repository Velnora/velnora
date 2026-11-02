# Assignment

What the coordinator sends a role to start its step. The role's whole input is this message, so everything it needs from earlier steps is pasted in, not referred to.

```md
🤖 Product coordinator: assignment for `<dept>-<role>`

**Task:** <issue URL and title, or "asked in chat">
**Step:** <step name from the route>, attempt <n>
**Job:** `docs/handoffs/<area>/<job>/<job>.md`
**Branch:** `<task branch>`, or "none yet" before the gate
**Delivery owner:** `<dept>-<role>`

**What to do:** <one or two sentences: this step's job on this task>

**The issue:**

<the issue's body and comments as `gh issue view` printed them, or the maintainer's words from chat>

**Inputs:**

- <each earlier output this step builds on, pasted in full: brief, plan, gate verdicts, review findings>
- <for a review step: the commit list and the diff against `master`, since reviewers can't run `git`>

**Earlier feedback on this step, if any:**

<the rejection or review this attempt must answer, with what would make it pass>

**Return:** your output in `docs/departments/<dept>/templates/<template>.md`, your handoff in `docs/templates/handoff.md`'s shape, and the commit hash if you committed.
```
