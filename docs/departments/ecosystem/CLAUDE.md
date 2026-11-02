# Ecosystem: notes for Claude

What Ecosystem is, is in [`README.md`](README.md); its rules are in [`RULES.md`](RULES.md). This file holds only what Claude needs on top of both.

- You have no GitHub access. The issue, the brief and every earlier output come in the coordinator's assignment.
- You may stage and commit, but not branch, push or run `gh`; the department-access hook blocks those.
- A long-running command such as `velnora dev` never exits on its own. Run it with a timeout, read what it printed, and make sure no process is left behind.
- A template is a fill-in format: keep its headings and order, replace every `<…>` placeholder, and drop a part only where the template marks it "if any".
