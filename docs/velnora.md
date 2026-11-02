---
title: Velnora
prev:
next: "[[00-products]]"
covers:
  - docs
---

# Velnora

Velnora is a TypeScript framework for running many small apps from one monorepo. You point it at a workspace, it finds every project in it, works out what each project needs to run, and serves them together. Its author's longer aim is a meta-framework for whole systems, sitting between application frameworks and infrastructure and covering Resolve → Build → Deploy → Run. Today only the first part is real. `velnora dev` finds the workspace, discovers its projects, loads their configuration and picks a runtime and an HTTP adapter for them, then stops short of serving anything. This book walks through it in order, from what the product is for down to how to work on the code. Every page ends by leading into the next one, so you can read it front to back or jump in anywhere.

## How the book is laid out

The book has six chapters, and each is split into systems: pieces that each do one job end to end, such as workspace discovery or the unit system. Every system is a folder that opens with what it does and what it can't do yet, and then goes into how it works.

The first chapter, [the product](01-products/00-products.md), says what Velnora is for, what a developer can do with it today, and how the project is run. It ends with the example workspace that exercises it.

The second, [the platform](02-platform/00-platform.md), covers the runtime. It follows a `velnora dev` run from finding the workspace through the Kernel to the units that plug into it, then describes the older server stack that is not wired in yet.

The third, [DevOps](03-devops/00-devops.md), covers how packages are built and released. The fourth, [the libraries](04-libraries/00-libraries.md), has one page per package. The fifth, [development](05-development/00-getting-started.md), takes you from a fresh clone to testing, generating a package and keeping the code clean. The sixth, [how we work](06-how-we-work/00-how-we-work.md), explains how a GitHub issue becomes a merged pull request and how that work is recorded.

Outside the numbered chapters sit the records the work leaves behind:

- The [departments](departments/README.md) folder holds the rules each AI agent role loads.
- `handoffs/` holds one folder per job, with a report from every piece of work on it.
- `templates/` holds the templates those notes start from.

The tasks themselves stay in GitHub issues on the [Velnora project board](https://github.com/orgs/Velnora/projects/4).

What is built and what is broken across the whole repository is tracked in [`STATUS.md`](../STATUS.md). The exact machine-readable contracts, such as the build helpers, the generator and git conventions, live in [`.claude/rules/`](../.claude/rules). This book links to both instead of repeating them.

## Reading it in Obsidian

The folder is an [Obsidian](https://obsidian.md) vault: open `docs/` itself with "Open folder as vault" to follow the links, backlinks and graph between the pages, jobs and handoffs. Every page's properties name the page before and after it, and the workspace paths it covers. Don't rename the vault inside Obsidian, since that renames the `docs/` folder on disk. After changing any page, `yarn nx run docs:check` checks the links, the page chain and the tables.

Start with [the product](01-products/00-products.md), which says what Velnora is trying to be.
