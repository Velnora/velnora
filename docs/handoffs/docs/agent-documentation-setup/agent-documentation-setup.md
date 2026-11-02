---
type: job
area: docs
status: in progress
tasks: []
updated: "2026-11-02"
---

# Agent and documentation setup

This job sets up how Velnora is documented and how Claude agents work on it, adapted from a reference project to Velnora's own shape, so a developer or agent can find how the code works, load the right rules, and resume work from a written record. The maintainer asked for it in chat, without an issue.

## How it works

[The book](../../../velnora.md) reads in six chapters, from the product through the platform, DevOps and every package to development and how we work, and each page was written from the code. Claude Code loads [`CLAUDE.md`](../../../../CLAUDE.md) and the rules under [`.claude/rules/`](../../../../.claude/rules), and a PreToolUse hook in [`.claude/settings.json`](../../../../.claude/settings.json) guards `.env` and Git by the calling agent. [The departments](../../../departments/README.md) describe five departments and eleven roles, with an agent file for each sub-agent role under `.claude/agents/`. `yarn nx run docs:check` checks the book, and [the templates](../../../templates) shape new jobs and handoffs.

## How it got here

A first pass adapted the reference setup for Codex, recorded in [the setup handoff](2026-10-31-session-setup-migration.md) and its corrections for [Codex only](2026-10-31-session-codex-only.md), [GitHub Projects](2026-10-31-session-github-projects.md) and [rule organisation](2026-10-31-session-rule-organization.md). The maintainer then asked for a clean-up: the runtime moved to Claude Code, the book was rewritten from the code, the legacy docs were folded in and deleted, the department roster was approved and written out, and the docs check was ported. [The clean-up handoff](2026-11-02-session-claude-setup-cleanup.md) records that work.

## Current state

Everything is committed on `chore/agent-setup/claude-departments` and open for review as [pull request 24](https://github.com/Velnora/velnora/pull/24). The clean-up handoff is the one to read first; the earlier four describe a Codex setup that no longer exists. The department flow is written but not automated: the coordinator starts each agent by hand. What still fails across the workspace is in [`STATUS.md`](../../../../STATUS.md).
