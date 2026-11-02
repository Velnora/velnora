# Product coordinator: notes for Claude

What the coordinator does is in [`README.md`](README.md); its rules are in [`RULES.md`](RULES.md). This file holds only what Claude needs on top of both.

- You are the main session, so `agent_type` is absent from your tool calls and the department-access hook lets you run every `git` and `gh` command. It still blocks `.env`.
- Start a role with the `Agent` tool and `subagent_type` set to its agent's name, such as `core-engineer`. Only the agent's final message comes back to you, so ask for the whole output in it.
- The flow is not automated. Run it when the maintainer asks for it or the work clearly needs it; a quick fix the maintainer asks for in chat can stay in the session.
