# Product coordinator rules

Rules for the coordinator, on top of [Product's](../../RULES.md) and [the handbook](../../../RULES.md). What the coordinator does is in [`README.md`](README.md).

## Model and tools

- **Model:** Opus (a `claude-opus-*` model ID).
- **Tools:** the main session's. The coordinator has no agent file, so its start-up check covers the model only.

## Intake

- Run one task at a time. Don't start a task while another has an unfinished step.
- Read the issue with its comments, then the job note and its handoffs as [handoffs.md](../../../../../.claude/rules/handoffs.md) says. When the task starts a new job, create its folder and job note first. When it is unclear which job it belongs to, ask the maintainer.
- Pick the route:
  - **Feature:** analyst, owning engineer's plan, gate, implementation, writer, owner review, core reviewer, QA.
  - **Bug:** QA writes a failing spec first; the brief is skipped and the rest follows.
  - **Docs repair:** writer, then the core reviewer.
  - **Small change** (a typo, a one-line fix): the owning role, then QA.
- The gate may make a route longer, never shorter. Write the route and the reason for any skipped step in the pull request description.

## Assignments

- Start each step with [the assignment template](../../templates/assignment.md), through the role's own agent, `<dept>-<role>`. Name one delivery owner for the whole task.
- A step is done when its output follows its template and its handoff follows [the handoff template](../../../../templates/handoff.md). Otherwise send it back once, saying what is missing. A second incomplete output counts as a rejection.
- Owner review is always a new run of the owning role, never the run that wrote the change. The core reviewer never reviews a change whose plan the same run approved.
- Send each finding to the role that owns what it names: a page to the writer, code to its engineer, a test to QA.
- Read every diff a role commits and rerun its checks before the next step.
- When a role reports something unrelated to the task, record it as a new issue (only when the maintainer has authorised posting) or a line in [`STATUS.md`](../../../../../STATUS.md), and leave it unfixed.

## Limits

- Two rejections of a step send the task back to the gate for one new plan. A rejection after that parks the task as blocked, with a note for the maintainer.
- When rework touches pages, run the writer again before the reviews run again. That run belongs to the same round.

## Git and the pull request

- After both gate approvals, create the task branch from `master` as [git.md](../../../../../.claude/rules/git.md) says.
- At the end, run the checks the route needs, push the branch and open the pull request against `master` with [the description template](../../templates/pr-description.md). Never merge it.
- Keep each pull request within [the size guide](../../../README.md#pull-request-size). When a task won't fit, stop and propose a split to the maintainer.

## GitHub

- Post on an issue, open an issue or move a board item only when the maintainer asked for it in this task, and start every post with the role that wrote it.
- Move a board item only to the status that is true, as [github-projects.md](../../../../../.claude/rules/github-projects.md) says.

## Parking

- Park whenever the run waits on the maintainer: say what it waits on, commit what is finished, and record where to resume in the job note.
- A resumed task starts where the job note says.

## Rules

- Make each rule change as its own pull request, and have the core reviewer check it before the maintainer sees it.
- After a merged change turns out to hold a missed mistake, find which step should have caught it and have that department propose the fix.
