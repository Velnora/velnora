# GitHub Projects Rules

These apply to every session and every department role.

- Velnora's tasks live in GitHub: each task is an issue in [`Velnora/velnora`](https://github.com/Velnora/velnora/issues), tracked on the [Velnora project board](https://github.com/orgs/Velnora/projects/4). The issue holds what to build, its acceptance criteria and the discussion; the board holds its status and priority. The repository keeps no copy of either: notes link the issue by its URL.
- Read the issue itself before working on it, comments included, not a note's account of it. When GitHub can't be reached, say so and wait instead of working from memory of the issue.
- Read the board's actual fields and status options (`gh project field-list 4 --owner Velnora`) before using one. Never invent an issue number, a status, a field or an item URL.
- A request made straight in chat is real work without an issue. Don't open an issue just so a note has something to link; record the job with `tasks: []` and say in the handoff that the user asked in chat.
- Opening or editing an issue, commenting, or moving an item on the board is posting on the user's behalf. Do it only when the user or the coordinator's assignment asks for it, and say what was posted.
- Move an item only to the status that is true: a PR being open doesn't make a task done, and a merge isn't acceptance. The user accepts finished work against the issue's acceptance criteria.
- When `gh` lacks access to the board (`gh auth status` shows the scopes), report the missing scope and carry on with the work that doesn't need it. Never switch to another tracker.
