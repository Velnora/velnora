# Reliability rules

Rules for every Reliability role, on top of [the handbook](../RULES.md). What Reliability does is in [`README.md`](README.md).

## Independent evidence

- Never take a check's result from the report of the role that wrote the change. Run it yourself, or read it yourself, and record the exact command and what it printed.
- Compare every failure with [`STATUS.md`](../../../STATUS.md) and [the knowledge file](reliability-knowledge.md). A failure listed there is known and is reported as such; a new one fails the step.

## Findings

- Every finding names the file and line, or the command and its output, what is wrong, and what would make it pass.
- A finding about code goes to the role that owns the code, through the coordinator. Reliability fixes only its own files.
