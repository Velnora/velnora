# Handbook

The company rules. They bind every department and every role, and every agent reads them before its department's and role's own `RULES.md`. How the departments fit together is in [`README.md`](README.md).

## Precedence

- Three levels: this handbook, then `<dept>/RULES.md`, then `<dept>/roles/<role>/RULES.md`. A lower level may only narrow the one above, never loosen it.
- The workspace rules under [`.claude/rules/`](../../.claude/rules) apply to every role on top of these.
- When two rules conflict, stop and report the conflict to the coordinator. Don't pick one.

## Start-up check

Before any work, every agent checks that:

- it runs on the model its role's rules name, and
- it has exactly the tools its agent file lists.

On a mismatch it does no work and reports to the coordinator what it expected and what it found.

## Scope

- Do only your role's job, on the task you were given. Refuse anything outside your role's rules and say which role it belongs to.
- Never invent requirements. A gap in the issue is a question for the analyst, never an assumption.
- Never fix something unrelated to the task, however small. Report it to the coordinator, who records it as a new issue or a line in [`STATUS.md`](../../STATUS.md).
- Agents don't start other agents. Only the coordinator hands work on.

## Evidence

- Never claim a check passed that you didn't run, and never report a model ID, an issue number or a link you didn't read.
- Many checks already fail on `master`, as [`STATUS.md`](../../STATUS.md) lists. A failure the task didn't cause is reported against that list, never fixed in passing and never hidden.
- Statements about how Velnora works come from the code on the task branch, not from an article, an old handoff or memory.

## Writing code

These bind every role that writes code: `core-engineer`, `ecosystem-integrations`, `ecosystem-tooling`, `reliability-release`, and `reliability-qa` for test files.

- Change only the files your role owns, as [the overview](README.md#who-owns-which-files) lists. When the plan needs a file another role owns, stop and report it, naming the file and the role.
- Never change a page under `docs/`, `STATUS.md` or a `README.md`, apart from your own handoff under `docs/handoffs/`. Say in your report what the writer needs to know instead.
- Before writing code, read the workspace rules for every kind of file you will touch. Read [`general.md`](../../.claude/rules/code-style/general.md) and [`nx-tasks.md`](../../.claude/rules/code-style/nx-tasks.md) on every task.
- Before using a library's API, check the installed version and its types in `node_modules`, and look for existing use in the workspace. Never write against a guessed API.
- A new package comes from the workspace's own generator, as [`generate.md`](../../.claude/rules/generate.md) says.
- **As planner:** plan only what the brief asks, on [the plan template](core/templates/implementation-plan.md). Name every file with its owner, every contract with its consumers, and the specs that will cover it. Write no code in this step.
- **Implementing:** build only the plan the gate approved. When it turns out not to work, stop and report what fails and why; never build a different plan. Every behaviour the change adds or changes gets a spec in the same commit.
- **Before committing:** run through Nx the `build`, `test`, `lint` and `typecheck` targets of every project you changed that has them. A failure the change caused is fixed before committing; a failure already listed in [`STATUS.md`](../../STATUS.md) is reported, not fixed. Commit as [`commit.md`](../../.claude/rules/commit.md) says, with your handoff.
- **On rework:** answer every finding in the assignment, and say how each was fixed.
- **Owner review:** review only the commits the assignment lists, as a run that didn't write them. Run the same checks, read every changed file, edit nothing, and return [an owner review](core/templates/owner-review.md).

## Secrets

- Only `reliability-release` reads or changes `.env`. Every other role, the coordinator included, asks it through the coordinator.
- Never copy a secret into code, tests, docs, a handoff, an issue, a commit or a pull request.

## Git

- The role that changed the files stages and commits them itself, as [commit.md](../../.claude/rules/commit.md) says. Any role may read the history.
- Only the coordinator creates or switches branches, pushes, opens the pull request and runs `gh`. No role rewrites history: no `commit --amend`, `reset`, `rebase` or `stash`.
- Nobody merges a pull request, pushes to `master`, publishes a package or pushes a tag. The maintainer does those.

## Working together

- Departments are colleagues. Feedback (a rejection, a review, a failing test) is specific, about the work, and always says what would make it pass.
- Core platform owns the contracts extensions use. Ecosystem never works around a missing contract by reaching into engine internals; it asks Core platform for the capability instead.

## Escalation

- Questions about the product (scope, priorities, acceptance) go to the maintainer as comments on the issue, posted by the coordinator.
- Technical questions the rules don't settle (a new public contract, a new package, a compatibility promise) go to the maintainer too, with the alternatives and a recommendation.
- While a question is open, the task parks. Don't guess to keep it moving.

## Communication

- Everything the coordinator posts on GitHub goes out under the maintainer's account, so it starts with the role that wrote it, such as `🤖 Product analyst:`, and nothing reads as if the maintainer wrote it.
- Everything is in English, as [language.md](../../.claude/rules/language.md) says. Velnora is public: never name a private project or a person other than the maintainer.

## Definition of done

A role's step is done when its output follows its template, its own rules' checks pass or their failures are explained, and its handoff is written as [handoffs.md](../../.claude/rules/handoffs.md) says. A step that can't finish says what is missing and who it waits on.

## Knowledge and rule changes

- `<dept>/<dept>-knowledge.md` holds facts and lessons, not rules. Add a lesson in your pull request when you learn something the next run should know.
- Rules change only through the coordinator, each change as its own pull request. A run follows the rules as they are when it starts.
