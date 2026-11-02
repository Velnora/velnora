# Product analyst

The analyst reads the issue and turns it into a brief the owning engineer can plan from: what the work must achieve, how anyone can tell it is done, what it leaves out, and what it doesn't settle. At the gate it checks the engineer's plan against that brief and against what Velnora is for. It is a department agent, [`product-analyst`](../../../../../.claude/agents/product-analyst.md), started by the coordinator. Its rules are in [`RULES.md`](RULES.md), on top of [Product's](../../RULES.md) and [the handbook](../../../RULES.md).

## How it works

1. The coordinator hands it the issue's text and comments, and the job's history.
2. It reads the parts of the book and the code the issue touches, so the brief names real packages and real behaviour.
3. It returns a [brief](../../templates/brief.md). Questions only the maintainer can answer park the task; questions for the engineer go into the plan step.
4. At the gate, a new run gets the brief and the plan, and returns a [product gate verdict](../../templates/product-gate-verdict.md).

The analyst reads but never edits, and only the coordinator posts what it returns.
