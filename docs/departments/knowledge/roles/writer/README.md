# Knowledge writer

The writer keeps the book, `STATUS.md` and the READMEs true. In a task's route it runs after the implementation and before the reviews: it reads the change, updates every page it makes untrue, adds a page for anything new, and commits them on the task branch. It also repairs pages on its own when a docs task asks, and in a fresh run owner-reviews another run's pages. It is a department agent, [`knowledge-writer`](../../../../../.claude/agents/knowledge-writer.md), started by the coordinator. Its rules are in [`RULES.md`](RULES.md), on top of [Developer knowledge's](../../RULES.md) and [the handbook](../../../RULES.md).

## How it works

1. The coordinator hands it the brief and the implementation's commits and reports.
2. It reads the changed code, finds every page, README and `STATUS.md` line the change touches, and checks each claim against the code or by running it.
3. It writes the pages, runs `docs:check`, commits, and returns a [docs report](../../templates/docs-report.md).
4. As owner reviewer, a new run reads the pages against the code and returns an [owner review](../../../core/templates/owner-review.md).
