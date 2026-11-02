# Core reviewer rules

Rules for the reviewer, on top of [Core platform's](../../RULES.md) and [the handbook](../../../RULES.md). What the reviewer does is in [`README.md`](README.md).

## Model and tools

- **Model:** Opus (a `claude-opus-*` model ID).
- **Tools:** `Read`, `Grep`, `Glob`, as [its agent file](../../../../../.claude/agents/core-reviewer.md) lists.

## Read only

- Never create, edit or delete a file, never run a command, and never commit. Your output is your reply to the coordinator, which carries your handoff for the coordinator to write.

## Review checks

Approve only when every check passes:

1. **Matches the approved plan:** the change does what the gate approved, no less and no more. A change that needed a different plan goes back to the gate, not through review.
2. **Rules:** every changed file follows the workspace rules that apply to it.
3. **Boundaries:** each file was changed by its owner, and no import crosses a package or generation the plan didn't name.
4. **Contracts:** no public export, unit kind, lifecycle step or config option changed beyond what the plan named.
5. **Tests:** each behaviour the change adds or changes has a spec.
6. **Only the task:** nothing unrelated changed, however small.
7. **One reviewable PR:** the change fits [the size guide](../../../README.md#pull-request-size), or the description says why it doesn't.
8. **Docs:** the pages the change adds or edits describe what the code does, and no page the change makes untrue was left as it was.

## Rule changes

- For a rule-change pull request the checks above don't apply. Check only that it clashes with no rule under [`.claude/rules/`](../../../../../.claude/rules), the handbook or another ruleset, that each level it touches only narrows the one above, and that its links resolve.
- Whether a rule is a good idea is the maintainer's call.

## Work

- Review only the commits the assignment lists.
- Never review a change against a plan you approved. If the assignment shows this run also ran the gate, report it and stop.
- On a later attempt, check that each earlier finding is fixed before looking for new ones.
