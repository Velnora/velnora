---
title: CI and release
prev: "[[00-build]]"
next: "[[00-libraries]]"
covers:
  - .github/workflows/next-release.yml
  - .changeset
---

# CI and release

Velnora has one GitHub Actions workflow, and it releases rather than checks. There is no workflow that runs lint, typecheck or tests on a pull request yet, so those run only when a developer or an agent runs them. This page covers the release workflow, changesets, and what is wrong with both today.

## The release workflow

[`.github/workflows/next-release.yml`](../../../.github/workflows/next-release.yml), named "Release (dev)", runs on every push to `master`. It checks out the code, sets up Node with the npm registry, enables Corepack, runs `yarn install --immutable` and `yarn build`, and then hands over to `changesets/action`. That action does one of two things. If there are unreleased changesets, it opens or updates a "Version Packages" pull request by running `yarn changeset version`. If that pull request has just merged, it publishes with `yarn changeset publish`. It reads `GITHUB_TOKEN` and `NPM_TOKEN` from the repository's secrets.

## Changesets

[`.changeset/config.json`](../../../.changeset/config.json) has the base branch `master`, publishes with public access, and bumps internal dependents by a patch. The repository is in pre-release mode with the `dev` tag (`.changeset/pre.json`), so a publish produces `-dev.N` pre-release versions on the `dev` npm tag rather than `latest`. Every package starts at `0.0.0-dev.0`. A pull request that changes what a user sees adds a changeset with `yarn changeset`; [the git rules](../../../.claude/rules/git.md) say when.

## What is wrong

The workflow sets up Node 20, while the root `package.json` requires Node 22 or newer and every package requires Node 24, so CI builds on a Node the packages don't support. `yarn build` builds `velnora` and what it depends on, which is the current generation only; the older tsup packages are never built in CI. Nothing in CI runs lint, typecheck or tests. Merging and publishing stay with the maintainer, and no agent publishes or pushes a tag.

That ends DevOps. [The libraries](../../04-libraries/00-libraries.md) chapter goes through every package one at a time.
