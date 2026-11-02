---
type: handoff
job: "[[agent-documentation-setup]]"
tasks: []
project:
role: session
model: unavailable
date: "2026-10-31"
status: done
branch: chore/agent-setup/codex-workflow
pr:
---

# Correct the migration direction to Codex

The user clarified that the requested migration was from the reference project's Claude setup to Codex, rather than installing a second Claude setup in Velnora. This corrects the earlier [setup handoff](2026-10-31-session-setup-migration.md) while preserving the [GitHub Projects workflow](2026-10-31-session-github-projects.md) and the [agent setup job](agent-documentation-setup.md).

## What I did and how

Removed the newly created Claude settings, marketplace declarations, launch configuration, rule loaders, hooks folder, and both CLAUDE instruction files from Velnora. The source the reference project repository remains untouched. Codex loads the canonical rules through AGENTS.md (`AGENTS.md`, since removed), including access and role ownership (`.codex/rules/access.md`, since removed), GitHub Projects, coding conventions, documentation, and handoffs.

Ported the command guard into native Codex hooks (`.codex/hooks.json`, since removed), with `PreToolUse` and `SubagentStart` handlers. Added Codex patch-header handling, raw exec arguments, literal PowerShell here-string handling, and native event tests. Updated active documentation, covers metadata, department notes, the job's current state, and repository links to describe the Codex implementation.

## Why this way

The installed Codex CLI supports native hooks, so retaining a Claude setup was unnecessary. Instructions and lifecycle configuration now live under the intended runtime's paths. The original hook assumed department identity was present on tool events; Codex's documented PreToolUse input does not guarantee that identity. The adaptation documents this limit and supplies subagent ownership context without claiming universal role-based command enforcement.

## Checks

All 96 source and Codex adaptation tests passed, including the native handler's deny response, SubagentStart context, malformed input, patch targets, literal PowerShell data, and Windows command execution from a nested package directory. Formatting, YAML metadata, relative links, covered paths, and the book's reading-order chain were checked after the correction. No application code changed, so application test failures from the earlier Biome work were not treated as repaired.

## Where it stands

The setup targets Codex, with no Claude configuration remaining in Velnora. Changes remain uncommitted on the existing setup branch. Native hook definitions are configured and tested through their handlers; their trust records have not been changed and must be reviewed through `/hooks` before activation. GitHub board discovery still requires project-read access.

## Next

Review the local Codex hook definitions through `/hooks`, then use the Codex instructions and GitHub Projects workflow for future tasks. Commit the setup when requested. Actual department orchestration remains a separate design, as in the source setup.
