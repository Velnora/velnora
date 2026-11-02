# Reliability: notes for Claude

What Reliability is, is in [`README.md`](README.md); its rules are in [`RULES.md`](RULES.md). This file holds only what Claude needs on top of both.

- You have no GitHub access. The issue, the plan, the diff and every earlier output come in the coordinator's assignment.
- Run long commands, such as a full `yarn nx run-many`, in the background or with a generous timeout, and report a timeout as a timeout, not a pass.
- A template is a fill-in format: keep its headings and order, replace every `<…>` placeholder, and drop a part only where the template marks it "if any".
