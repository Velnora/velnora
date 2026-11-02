---
title: How we work
prev: "[[03-code-quality]]"
next: "[[01-tasks-jobs-and-handoffs]]"
covers:
  - CLAUDE.md
  - .claude/rules
  - .claude/agents
  - docs/departments
---

# How we work

Velnora has one founder, the maintainer, who acts as its CEO. Claude agents do most of the day-to-day work as departments of the company, and the maintainer decides product direction, accepts finished work, merges pull requests and publishes releases. Anything the departments can't settle between them goes to the maintainer.

## Where work comes from

Tasks are GitHub issues in [`Velnora/velnora`](https://github.com/Velnora/velnora/issues), tracked on the [Velnora project board](https://github.com/orgs/Velnora/projects/4). The issue says what to build and how it will be accepted, and the board holds its status. The maintainer can also ask for work straight in chat, which needs no issue. [The GitHub Projects rules](../../.claude/rules/github-projects.md) cover reading and updating them.

## The departments

| Department          | Roles                         | Looks after                                                           |
| ------------------- | ----------------------------- | --------------------------------------------------------------------- |
| Product             | coordinator, analyst          | Routing the work, the issue's intent, Git and the pull request        |
| Core platform       | architect, reviewer, engineer | The kernel, units, runtimes, types and the older core packages        |
| Ecosystem           | integrations, tooling         | Framework integrations, adapters, the CLI, the generator and examples |
| Reliability         | qa, security, release         | Tests, trust boundaries, builds, CI and publishing                    |
| Developer knowledge | writer                        | This book, `STATUS.md` and the package READMEs                        |

The main Claude session is the Product coordinator. Every other role is a sub-agent defined under `.claude/agents/`. [The departments](../departments/README.md) describe each role and what it may touch.

## How a change moves

1. The analyst reads the issue and writes a brief of what it asks.
2. The engineer who owns the code plans the change.
3. The analyst checks the plan against the issue and the architect checks it technically. Both must agree before any code is written.
4. The engineer implements it, with its tests.
5. The writer updates the book and any README the change affects.
6. The owning department reviews it, with security joining when a trust boundary moves. Then the reviewer, who never reviews a change it gated, reviews it again.
7. QA runs the tests and the example workspace.
8. The coordinator opens the pull request, and the maintainer merges it.

Changes to the rules themselves go through the coordinator as their own pull request.

## Git

`master` is the only long-lived branch. Every change happens on a task branch such as `feat/kernel/42-http-listener` and reaches `master` through a pull request. Commits follow Conventional Commits. Nobody but the maintainer merges, pushes to `master` or publishes a package. [The Git rules](../../.claude/rules/git.md) and [commit rules](../../.claude/rules/commit.md) hold the details.

What each piece of work leaves behind is next, in [tasks, jobs and handoffs](01-tasks-jobs-and-handoffs.md).
