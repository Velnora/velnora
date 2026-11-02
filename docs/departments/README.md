# Departments

How Velnora work moves from a GitHub issue to a merged pull request, done by Claude agents organised as a company's departments. Why the departments are drawn this way is in [the project foundation](../01-products/01-velnora/01-project-foundation.md). The rules every role follows are in the handbook, [`RULES.md`](RULES.md).

**Status:** the five departments, their eleven roles and the ten agent files are written. Nothing runs on its own: the coordinator starts each agent by hand when a task calls for it. What is built and what is left is in [`STATUS.md`](../../STATUS.md).

## The idea

- A **department** owns a lasting outcome, such as predictable engine behaviour or a usable path from a real project into Velnora.
- A **role** is one kind of work inside it, done by one Claude agent named `<department>-<role>`, such as `core-engineer`.
- Every department and role has written rules. They are the agent's hard boundary, and the same files tell a developer what that role does.
- A task goes through only the roles it needs. A small change skips most of them; ceremony has to earn its place.

## People

Velnora has one founder, the maintainer, who is its CEO. The maintainer sets product direction, writes or approves the issues, accepts finished work, merges every pull request and publishes every release. Every question the departments can't settle goes to the maintainer, through the coordinator.

## Roster

| Department                                 | Roles                         | Model  | Does                                                                                                                      |
| ------------------------------------------ | ----------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------- |
| [Product](product/README.md)               | coordinator, analyst          | Opus   | coordinator: the main session; routes work, runs Git and `gh`, opens the PR. analyst: the brief and the product-fit gate  |
| [Core platform](core/README.md)            | architect, reviewer, engineer | Mixed  | architect (Opus): the technical gate. reviewer (Opus): reviews every change it didn't gate. engineer (Sonnet): the engine |
| [Ecosystem](ecosystem/README.md)           | integrations, tooling         | Sonnet | integrations: framework integrations and adapters. tooling: the CLI, the generator, the facade and the examples           |
| [Reliability](reliability/README.md)       | qa, security, release         | Mixed  | qa (Sonnet): tests and example runs. security (Opus): trust boundaries. release (Sonnet): builds, CI and publishing       |
| [Developer knowledge](knowledge/README.md) | writer                        | Sonnet | The book, `STATUS.md` and the package READMEs, in the same PR as the code                                                 |

Opus does the judgment roles and Sonnet the execution roles. There is no department for policy: the coordinator keeps the rules, since one maintainer is the whole company.

## Who owns which files

| Owner                    | Files                                                                                                                                                                        |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `core-engineer`          | `libs/kernel`, `libs/host`, `libs/types`, `libs/utils`, `libs/unit/runtime/*`, `libs/runtime/*`, `libs/router`, `libs/rpc`, `libs/contracts`, `libs/plugin-api`, `libs/core` |
| `ecosystem-integrations` | `libs/integrations/*`, `libs/vite/integration`, `libs/unit/adapter/*`                                                                                                        |
| `ecosystem-tooling`      | `libs/cli`, `packages/cli`, `libs/helper/*`, `libs/generator`, `libs/devkit`, `libs/velnora`, `examples/*`                                                                   |
| `reliability-release`    | Every build and tool config wherever it sits, the root files, `libs/internal`, `scripts/`, `.github/`, `.changeset/config.json`, `.yarn/` and `.env`                         |
| `reliability-qa`         | Test files (`*.spec.ts`, `*.test.ts`), shared with the engineer who owns the code beside them                                                                                |
| `knowledge-writer`       | `docs/` except `departments/`, `handoffs/` and `templates/`, `STATUS.md`, the root and package READMEs                                                                       |
| Product coordinator      | `docs/departments/`, `docs/templates/`, `.claude/` and `CLAUDE.md`                                                                                                           |

- A build or tool config is `project.json`, `vite.config.ts`, `vitest.config.ts`, `tsup.config.ts` and `tsconfig*.json`. In a package's `package.json`, the owning engineer may add a dependency its code needs, with the `yarn.lock` change; scripts, `exports` and `engines` are the release role's.
- Every role writes its own handoffs under `docs/handoffs/`, and the owning engineer adds the changeset under `.changeset/` for a change users would notice.

## Flow

```text
GitHub issue, or a request in chat
  -> Product analyst     the brief: what the issue asks, and what it leaves open
  -> Owning engineer     the plan
  -> Gate                the analyst for product fit, the architect for technical fit; both must approve
  -> Owning engineer     implements the approved plan, with its unit tests
  -> Knowledge writer    the pages and READMEs the change makes untrue, before anyone reviews
  -> Owner review        a fresh run of each owning role, plus security when a trust boundary moves
  -> Core reviewer       the whole change against the plan and the rules
  -> Reliability qa      the tests, and the example workspace when behaviour changed
  -> Coordinator         pushes the branch and opens the PR
```

- The owning engineer is whichever role owns the files the change touches: `core-engineer`, `ecosystem-integrations`, `ecosystem-tooling` or `reliability-release`. A change across owners has one delivery owner, named in the assignment, and the others plan their own files.
- The route depends on the work. A typo goes straight to the writer and the reviewer. A docs repair needs no gate. The gate may make a route longer, never shorter.
- A bug skips the brief: QA reproduces it with a failing spec first, then its owner fixes it.
- When the brief leaves a question only the maintainer can answer, the task parks until the maintainer answers.
- When a review or QA sends work back twice, the task goes back to the gate to be planned again once. If that fails too, it parks as blocked.
- One run ends in one reviewable pull request. The maintainer merges it and accepts the work against the issue.

## Where things live

```text
docs/departments/
  README.md, RULES.md, CLAUDE.md          this page, the handbook, Claude notes for the whole folder
  <dept>/README.md, RULES.md, CLAUDE.md   the department's description, rules and Claude notes
  <dept>/<dept>-knowledge.md              facts and lessons, not rules
  <dept>/templates/                       exact formats for what its roles hand back
  <dept>/roles/<role>/README.md, RULES.md, CLAUDE.md
.claude/agents/<dept>-<role>.md           model, tools, and "read and obey your rules first"
```

- `README.md` describes the folder: what the department or role is and how it works.
- `RULES.md` holds only rules, in three levels: the handbook, the department, the role. A lower level may only narrow the one above.
- `CLAUDE.md` holds Claude mechanics: tools, models and how to treat the files. Claude Code loads it into any session that reads a file in its folder, so it never holds rules for one role only.

## Safety

- **Least privilege.** Each agent file lists only the tools its role needs. The analyst, the architect and the reviewer read and never edit. QA edits only test files, the writer only pages. No agent can start another agent.
- **`.env`.** Only `reliability-release` may read or change it; the main session is denied too. Velnora has no `.env` file today.
- **Git.** Each role commits its own changes. Only the coordinator creates branches, pushes, opens pull requests and runs `gh`. Nobody merges or pushes to `master`.
- **Model check.** Every agent checks at start-up that it runs on the model its rules name, and refuses on a mismatch.

Tool lists can't limit a tool to certain files or commands, so a project hook enforces `.env` and Git by the calling agent's name: [`.claude/hooks/department-access`](../../.claude/hooks/department-access).

## Pull request size

- The goal is a pull request the maintainer can review in one sitting. About 400 hand-written changed lines or 20 files is a guide, not a cutoff; a larger coherent change says why in its description.
- When a task won't fit, work stops and the coordinator proposes a split along a real seam, such as one package or one lifecycle step.
- Mechanical changes (renames, formatting, dependency bumps) get their own pull request, produced by a command quoted in its description.

## How the rules change

- A rule change is its own small pull request, separate from feature work, made by the coordinator. It applies from the next run after it merges.
- The core reviewer checks it before the maintainer sees it: that it clashes with no rule under [`.claude/rules/`](../../.claude/rules) or here, and that each level only narrows the one above. Whether a rule is a good idea is the maintainer's call.
- When a merged change turns out to hold a mistake the departments missed, the coordinator finds which step should have caught it, and that department proposes a rule or checklist change. The point is a better process, never blame.
- Work no role covers parks the task while the coordinator drafts the new role as its own pull request.
