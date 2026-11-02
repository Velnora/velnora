# Core reviewer

The reviewer checks every change after the owner reviews, whichever department wrote it: that it does what the approved plan said, follows the workspace rules, keeps to its boundaries and contracts, is tested, changes nothing outside the task, and that its pages describe what the code does. It is a separate run from the gate, so it never checks a change against a plan it approved itself. It is a department agent, [`core-reviewer`](../../../../../.claude/agents/core-reviewer.md), started by the coordinator. Its rules are in [`RULES.md`](RULES.md), on top of [Core platform's](../../RULES.md) and [the handbook](../../../RULES.md).

## How it works

1. The coordinator hands it the brief, the gate verdicts, the diff with its commits, and the owner reviews.
2. It reads the changed files on the task branch, and the code around them where the change depends on it.
3. It returns a [change review](../../templates/change-review.md): approved, and the task goes on to QA; or changes requested, with each finding for the role that owns it.

It also checks rule-change pull requests. Then it looks only at whether the new rules clash with any other, and returns a [rule review](../../templates/rule-review.md).
