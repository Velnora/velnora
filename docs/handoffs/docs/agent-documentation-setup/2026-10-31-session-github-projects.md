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

# Use GitHub Projects for task tracking

The user clarified that Velnora uses GitHub Projects. This corrects the tracker-neutral choice in [the setup migration](2026-10-31-session-setup-migration.md) and continues the [agent setup job](agent-documentation-setup.md). The clarification came directly in chat without a linked issue.

## What I did and how

Added a canonical GitHub Projects rule (`.codex/rules/github-projects.md`, since removed), loaded through both agent entrypoints and Claude's rule folder. Updated handoff policy, templates, the working-process chapter, department documents, project status, and the existing acceptance checklist to use GitHub Projects and linked GitHub issues. Templates now include optional `project` metadata for a verified board URL, separate from the task URLs in `tasks`.

## Why this way

GitHub issues retain requirements and discussion, while the project retains planning fields and workflow state. The actual board owner, fields, and status values must be read rather than inferred from repository ownership. Direct chat requests can proceed without a fabricated issue. The earlier completed handoff remains as history; this note records the correction explicitly.

## Checks

The GitHub repository-project discovery query returned an insufficient-scope error: the current CLI token lacks `read:project`. No board link or successful project update was invented. Repository formatting, YAML metadata, and relative links were checked after the documentation updates. No application or hook code changed, so their test suites were not rerun for this correction.

## Where it stands

The local setup now selects GitHub Projects as the tracker. Changes remain uncommitted with the setup migration. No GitHub issue, board item, field, comment, or status was changed remotely, and the board URL remains empty until it is verified.

## Next

When project access is needed, grant the GitHub credential project-read access and discover or supply the actual board URL. Read the task and current project schema before an authorized task update.
