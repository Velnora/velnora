# Developer knowledge

The developer knowledge department keeps Velnora understandable: the book under `docs/`, `STATUS.md`, and every `README.md`. It documents what the code does on the task branch, marks design intent as intent, and writes its pages in the same pull request as the code, before anyone reviews, so every reviewer sees the code and its pages together.

How it fits with the other departments is in [the overview](../README.md). Its rules are in [`RULES.md`](RULES.md), on top of [the handbook](../RULES.md).

## Roles

| Role                             | Model  | Does                                                                          |
| -------------------------------- | ------ | ----------------------------------------------------------------------------- |
| [writer](roles/writer/README.md) | Sonnet | Writes and repairs the book, `STATUS.md` and the READMEs; owner-reviews pages |

## What it gets and gives

- **In:** the brief and the implementation's commits and reports, or a docs repair on its own.
- **Out:** committed pages and a [docs report](templates/docs-report.md), or, in a fresh run, an [owner review](../core/templates/owner-review.md) of another run's pages.

## Files

- [`knowledge-knowledge.md`](knowledge-knowledge.md): how the book is checked and lessons from earlier pages.
- [`templates/`](templates): the docs report.
- [`roles/writer/`](roles/writer/README.md): how the writer works.
