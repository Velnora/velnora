# Git Rules

## Never guess

- Never guess a `git`/`gh` subcommand, flag, or piece of workflow behavior. Check `git <cmd> --help` / `gh <cmd> --help` (or official docs) first.
- Never guess repo state either — which branch something landed on, whether a PR is open/merged, whether a branch is ahead/behind, whether something was already pushed. Verify with a read-only command (`git status`, `git log`, `git branch -a`, `gh pr view`, etc.) before acting or reporting.
- If checking still leaves it unclear, ask the user instead of assuming. This applies especially to anything destructive, anything that touches the remote, or anything affecting a branch/PR you didn't create in this session.

## Branching (before any implementation)

Before any code changes — before implementing, not after — make sure the work happens on a fresh branch created from `master`. If the current branch is a finished or unrelated one, create a new branch instead of piling onto it.

### The base branch

- `master` is this repo's only long-lived branch. Every task branch starts from it and every PR targets it.
- There is no `develop`, `preprod` or release branch. If the user mentions another base, or the base is otherwise unclear, ask which one to use instead of guessing.

### Create and switch

1. Refresh the base without checking it out: `git fetch origin master:master`. This keeps the current working branch in place. It is fast-forward only — never prefix the refspec with `+`. If git refuses (`master` is checked out somewhere, or the update isn't a fast-forward), stop and ask the user instead of forcing it.
2. Create and switch to the task branch directly from that ref: `git checkout -b <new-branch> master^0 --` (e.g. `git checkout -b feat/kernel/server-startup master^0 --`).

- Do not check out `master` just to create a task branch.
- Never use a remote-tracking ref such as `origin/master` as the start point: git then sets it as the new branch's upstream, and a bare `git push` would aim at `master`. Start from `master^0` — the exact commit, no upstream.
- For a chained branch (see below) the base is the previous link's local branch: `git checkout -b <next-link> <previous-link>^0 --`, with no fetch for it.

### Naming

- Branch naming: `<type>/<section-or-module>/<issue-number-if-provided>-<description>`, where `<type>` matches Conventional Commit types (`fix/`, `feat/`, `docs/`, `chore/`, `refactor/`, etc.) and `<section-or-module>` is the library or area the change touches — e.g. `fix/kernel/42-http-listener`, `docs/book/library-pages`. Omit the issue segment (and its trailing hyphen) entirely when the work has no GitHub issue — e.g. `chore/biome/lint-rules`.

## Pull requests

- When a PR is called for, open it directly with `gh pr create` — don't hand back a manual GitHub compare link unless `gh` is genuinely unavailable and there's no way to install/authenticate it.
- Always write a full PR description, not just a title: what changed, why, and anything a reviewer should know (a test plan, follow-ups, risks). Link the GitHub issue it closes with `Closes #<number>` when there is one.
- Before opening a PR, confirm the branch is pushed and check whether one already exists for it (`gh pr list --head <branch>`) instead of assuming and creating a duplicate.
- Assign every PR to the GitHub user `gh` is signed in as: open it with `gh pr create --assignee "@me"`. For a PR that is already open and unassigned, run `gh pr edit <number> --add-assignee "@me"`. `gh api user --jq .login` shows who that is.
- A change a user of the published packages would notice gets a changeset (`yarn changeset`) in the same PR. Docs, tests, rules and workspace tooling don't.

## After a PR is merged

When the user says a PR is merged (even just "merged"), clean up straight away and do not ask first. Asking is the annoyance, not the deletion.

1. Verify it: `gh pr view <number> --json state,mergedAt` must say `MERGED`.
2. Switch to `master` and bring it up to date, fast-forward only: `git checkout master`, `git fetch origin`, `git merge --ff-only origin/master`. `master` is checked out here, so the `git fetch origin master:master` form from [Branching](#branching-before-any-implementation) does not apply.
3. Delete the merged branch locally with `git branch -d <branch>` (never `-D`), after `git branch --merged master` lists it.
4. Delete it on origin with `git push origin --delete <branch>` only if `git ls-remote --heads origin <branch>` still shows it. GitHub often removes it on merge.
5. `git fetch --prune origin`, then report it in one line.

- This covers only a branch created for a PR in this work that is verified merged into `master`. It does not cover an unmerged branch, a branch someone else made, `master` itself, or a force-push or history rewrite: those still need the explicit confirmation in [Safety](#safety).
- In a chain (below), clean up each link once its own PR has merged.

## Chained (Stacked) Branches

When more than one feature needs its own separate PR/review but each depends on the previous one's code, chain the branches instead of branching each off `master` independently or bundling them into one PR.

- Branch each link off the previous link, not off `master`: e.g. `feat/foo/a` off `master`, `feat/foo/b` off `feat/foo/a`, `feat/foo/c` off `feat/foo/b`.
- Push every branch in the chain. Open the first link's PR against `master`; open each subsequent link's PR against the branch immediately before it in the chain (not against `master`), so its diff only shows that link's own changes.
- After opening the chain's PRs, monitor the earliest open one for merge instead of repeatedly asking the user to check — via the PR monitor tools for CI/conflicts/reviews, or a background/`/loop` check for a review that may take a while.
- When a link's PR merges and its branch is deleted, GitHub automatically retargets the next link's PR base to `master`. Then merge `master` into the next branch in the chain and push normally (no rebase, no force-push) to bring it up to date — this never rewrites already-pushed history, so it doesn't trigger the force-push confirmation rule below.
- Repeat for each remaining link until the whole chain has landed.
- If a branch chain exists with no active monitor watching it — a new session, a restart, or a chain you only know about from prior context rather than one you just set up — start a new monitoring agent for it rather than leaving it unwatched.
- The monitor must not assume exactly one merge happens between checks. Walk the chain forward however many links have already merged by the time it looks, and treat an already-merged or already-deleted branch it expected to still be open as normal progress to pick up from, not an error to throw on.

### GitHub stacks

- When a chain has more than one PR, also group its PRs as a GitHub stack with GitHub's official `gh stack` extension ([github/gh-stack](https://github.com/github/gh-stack)), so GitHub shows them as one stack. Check `gh stack <command> --help` before using a command or flag.
- If `gh stack` isn't installed, ask the user before running `gh extension install github/gh-stack`. Stacked PRs is a GitHub preview that works only where it is enabled for the repository. If `gh stack` refuses because of that, keep the plain chain above and tell the user once.
- Build the stack from the chain once its PRs are open: create, push and open each link as described above, then `gh stack link <pr> <pr> ...` with the PR numbers from bottom to top. `link` needs no local stack tracking.
- Don't use the `gh stack` commands that push or rewrite branches: `rebase`, `sync`, `modify`, `push` and `submit`. They rebase and push with `--force-with-lease`. Keep updating a link by merging `master` into it, as above. Running one of them needs the same explicit confirmation as any force-push.
- Never run `gh stack merge`, since merging stays with the user. Never run `gh stack unstack` without confirmation, since it also removes the stack on GitHub.

## Safety

- When a task's work on its own task branch is done and verified, commit it, push that branch, and open its PR against `master` without asking first — see [commit.md](commit.md) for message format. Report the PR link afterwards. Merging stays with the user; never merge a PR yourself.
- A sub-agent, whether a department agent or any other, may only stage, commit and read history (`add`, `apply`, `mv`, `rm`, `commit` without `--amend`, `status`, `diff`, `log`, `show`, `blame`, `grep`, `ls-files`, `rev-parse`). Branching, pushing, history rewrites and every `gh` call stay with the main session. [`.claude/hooks/department-access`](../hooks/department-access) blocks the rest.
- Before committing, check what's actually staged/changed (`git status` / `git diff --cached`) and confirm the current branch is the correct one for that change — a merged feature branch, a stray `git reset`, or simply not checking can leave you sitting on `master` without noticing. Switch to the right branch first rather than let a commit land wherever `HEAD` happens to be.
- Never push directly to `master` — push feature branches and open a PR instead. Only push straight to `master` when the user explicitly says so for that specific push; it's never the default, and one explicit instruction doesn't carry over to the next push.
- Never run `changeset publish`, `npm publish` or anything else that publishes a package, and never push a tag. Releasing stays with the user.
- Never force-push, `reset --hard`, rewrite already-pushed history, or delete a branch without explicit confirmation for that specific action. The one standing exception is the cleanup of a verified-merged PR branch described in [After a PR is merged](#after-a-pr-is-merged).
- Run `git status` before any command that could discard uncommitted work.
- Never bypass hooks (`--no-verify`) or signing (`--no-gpg-sign`) unless explicitly asked.
