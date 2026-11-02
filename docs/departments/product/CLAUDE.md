# Product: notes for Claude

What Product is, is in [`README.md`](README.md); its rules are in [`RULES.md`](RULES.md). This file holds only what Claude needs on top of both.

- The coordinator is the main session and has every tool the session has. The analyst is a sub-agent with read-only tools.
- The analyst can't run `gh`, so the coordinator reads the issue with `gh issue view <number> --repo Velnora/velnora --comments` and pastes its text into the assignment.
- A template is a fill-in format: keep its headings and order, replace every `<…>` placeholder, and drop a part only where the template marks it "if any".
