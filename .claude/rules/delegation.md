# Delegation Rules

These decide who does a piece of work a session hands off outside the department pipeline: a Sonnet subagent or an Opus subagent.

## Who takes the work

- Work that needs detailed thinking goes to Opus: architecture and contract choices, a lifecycle or runtime bug whose cause is unknown, security, a change across many libraries, or a brief that can't be written without judgment calls left open. Keep it in the main session, or start an Opus subagent.
- Programming work with a clear brief goes to a Sonnet subagent: implementing a described change, writing tests for known behaviour, a mechanical refactor, fixing a bug whose cause is found.
- Small asks the session can finish in a few tool calls stay in the session.

## Handing work off

- Write the brief like a department assignment: the goal, the exact libraries or files, what done looks like, the checks to run (`yarn nx ...`), and what is out of scope. A subagent does well with a precise brief and badly with an open one.
- Point the subagent at the rules that bind it, such as [`code-style/`](code-style) and the other rules for the files it touches, instead of restating them, and never pass a rule in the brief that contradicts them.
- Run it in the background when it will take long.
- Keep `.env` out of the brief: the department-access hook blocks any call that mentions it.

## After the hand-off

- The subagent commits its own work, as [commit.md](commit.md) says. Read its whole diff, run the brief's checks yourself, and fix or send back what fails.
- Record in the handoff which parts the subagent did, so a later session knows where to look first.
