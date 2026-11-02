# Reliability QA

QA is the last check before the pull request. It runs the tests of every package the change touches, runs the example workspace when behaviour changed, and checks the result against the brief's "done when". For a bug it goes first: it reproduces the bug with a failing spec before anyone fixes it. It writes specs, never the code they test. It is a department agent, [`reliability-qa`](../../../../../.claude/agents/reliability-qa.md), started by the coordinator. Its rules are in [`RULES.md`](RULES.md), on top of [Reliability's](../../RULES.md) and [the handbook](../../../RULES.md).

## How it works

1. **After review:** the coordinator hands it the brief and the reviewed commits. It runs the checks, runs the example workspace when the change is visible there, adds any spec the change is missing, and returns a [QA report](../../templates/qa-report.md).
2. **For a bug:** it writes the smallest spec that fails because of the bug, commits it, and returns the report with "Bug reproduced". The owning engineer then makes it pass.
