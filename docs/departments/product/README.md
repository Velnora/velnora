# Product

The product department keeps every change pointed at what Velnora is for. Its coordinator routes the work and runs everything that touches Git and GitHub; its analyst makes sure the work does what the issue asks, and that the issue fits the product. The maintainer owns the product itself: the department applies the direction the maintainer set and brings back anything that direction doesn't settle.

How it fits with the other departments is in [the overview](../README.md). Its rules are in [`RULES.md`](RULES.md), on top of [the handbook](../RULES.md).

## Roles

| Role                                       | Model | Does                                                                                     |
| ------------------------------------------ | ----- | ---------------------------------------------------------------------------------------- |
| [coordinator](roles/coordinator/README.md) | Opus  | The main session: takes the task in, picks the route, hands work on, runs Git and the PR |
| [analyst](roles/analyst/README.md)         | Opus  | Writes the brief from the issue, finds its gaps, and gives the product half of the gate  |

## What it gets and gives

- **Coordinator in:** an issue on the [project board](https://github.com/orgs/Velnora/projects/4), or a request from the maintainer in chat.
- **Coordinator out:** an [assignment](templates/assignment.md) for each step, and at the end a pull request with [its description](templates/pr-description.md).
- **Analyst in:** the issue's text and comments, pasted into the assignment, and for the gate the owning engineer's plan.
- **Analyst out:** a [brief](templates/brief.md), and at the gate a [product gate verdict](templates/product-gate-verdict.md).

## Files

- [`product-knowledge.md`](product-knowledge.md): what Velnora is for today and lessons from earlier briefs.
- [`templates/`](templates): the assignment, the brief, the gate verdict and the pull request description.
- [`roles/coordinator/`](roles/coordinator/README.md) and [`roles/analyst/`](roles/analyst/README.md): how each role works.
