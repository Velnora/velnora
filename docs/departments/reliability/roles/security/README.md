# Reliability security

The security role reviews the changes that move a trust boundary in a framework other people will run: how a dev or production server handles requests, how files named by user input are read, what code Velnora executes and from where, which dependencies it pulls in, and what each package publishes. The architect adds it to a route; any reviewer can flag a change for it. It is a department agent, [`reliability-security`](../../../../../.claude/agents/reliability-security.md), started by the coordinator. Its rules are in [`RULES.md`](RULES.md), on top of [Reliability's](../../RULES.md) and [the handbook](../../../RULES.md).

## How it works

1. The coordinator hands it the plan and the diff, with the boundaries the architect named.
2. It reads the changed code and what calls it, and checks the dependencies and the packed files where the change touches them.
3. It returns a [security review](../../templates/security-review.md). A finding goes to the role that owns the code.

It reviews but never edits.
