---
type: handoff
job: "[[agent-documentation-setup]]"
tasks: []
project:
role: session
model: unavailable
date: "2026-10-31"
status: done
branch: chore/agent-setup/claude-departments
pr:
---

# Restore grouped rule ownership

The user requested the reference setup's folder organization rather than a flat collection of rule files. This continues the [agent setup job](agent-documentation-setup.md) after the [Codex migration correction](2026-10-31-session-codex-only.md).

## What I did and how

Grouped coding rules under code-style (`.codex/rules/code-style`, since removed), consolidated the four general sections into `general.md`, and split Nx task execution from Nx project configuration. The root now contains nine workflow rules, while `code-style/` contains ten focused rule files. AGENTS.md (`AGENTS.md`, since removed) lists every rule once and preserves the frontmatter-based loading policy.

## Why this way

The directory now expresses the same ownership boundaries as the supplied reference. General coding guidance stays together, technology rules share one group, and workflow rules remain easy to locate at the root. No compatibility stubs or duplicate rule copies are retained.

## Checks

The transformation preserved all four general sections and all 18 Nx rule bullets. YAML metadata, expected folder structure, complete AGENTS.md loading coverage, relative links, covered paths, reading order, formatting, and whitespace were checked. Native hook implementation did not change, so its 96-test suite was not rerun for rule-file organization.

## Where it stands

The rules are grouped and the local setup remains uncommitted on `chore/agent-setup/claude-departments`. GitHub Projects remains the task tracker, and native Codex hook configuration stays separate from rule documents.

## Next

Keep new coding rules in the coding group and new workflow rules at the root. Update the loader and links whenever ownership or a filename changes.
