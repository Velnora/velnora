---
title: The product
prev: "[[velnora]]"
next: "[[00-velnora-framework]]"
covers:
  - README.md
  - libs/velnora
---

# The product

Velnora has one product, the framework itself, published as the `velnora` package with a `velnora` command. This chapter says what it is for, what a developer can already do with it, and how the project behind it is run. It ends with the checked-in workspace that exercises the framework.

## What it is for

A monorepo of micro-apps usually needs a lot of glue: a dev server per app, a proxy in front of them, per-framework build setups and scripts that start everything in the right order. Velnora's aim is to own that glue. It discovers the projects in a Yarn workspace, recognises what each one is (a Node app, a React client, a Nest server), and serves all of them through one host, each under its own URL. Further out, the author's [Why Velnora?](https://medium.com/@veysaliyev00/why-velnora-2e8cdea1b04a) describes it as a meta-framework for systems that manages Resolve → Build → Deploy → Run, so developers stop maintaining infrastructure configuration by hand. That is the stated direction, not a description of the current code.

Three principles from the project's first overview still hold. Every layer has one job. Contracts are typed and tested. The developer decides what runs, and Velnora wires it together.

## What it can do today

A developer can run `velnora init` to create a workspace, configure it in `velnora.config.ts`, and run `velnora dev`. The dev command finds the workspace root, discovers every project in it, loads the configuration, and builds a graph of units. Units are the pieces that plug into Velnora: a runtime such as Node, an HTTP adapter such as h3, and integrations. The command then configures every unit and picks an HTTP adapter and a runtime for each project.

It stops there. The code that would open the HTTP listener is commented out, so nothing is served yet. The `build`, `list`, `graph` and `doctor` commands exist but do nothing. [The framework page](01-velnora/00-velnora-framework.md) goes through each command, and [`STATUS.md`](../../STATUS.md) keeps the full list of what is broken.

## The first milestone

The first release, v0.1 "Kernel skeleton", aimed for `velnora dev` to serve every discovered project on `localhost:3000` under its own path. An earlier version of the Kernel did exactly that through the h3 [Host](../04-libraries/06-libs-host.md), and that behaviour is still the target. Since then the Kernel moved to the unit system and lost the step that starts the server.

What v0.1 still lacks:

- A served host again.
- Zero-config mode.
- A built-in static adapter.
- The "Hello Velnora" demo: an `index.html` served at `localhost:3000`.

`velnora init` writing a config file is done.

The next page, [the Velnora framework](01-velnora/00-velnora-framework.md), shows what using it looks like from a developer's seat.
