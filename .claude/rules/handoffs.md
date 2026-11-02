# Handoff Rules

These apply to every session and every department role. What jobs and handoffs are for, for a developer, is in [tasks, jobs and handoffs](../../docs/06-how-we-work/01-tasks-jobs-and-handoffs.md).

## Tasks, jobs and handoffs

- A **task** is a GitHub issue on the Velnora project board, the source of truth for what to build (see [github-projects.md](github-projects.md)). The repository keeps no copy or summary of it: notes link it by its issue URL. Work the user asks for straight in chat is a task without an issue.
- A **job** is a lasting piece of Velnora, such as the Kernel's server startup or the React integration. It is not a task: a job takes any number of issues over its life.
- A **job** note describes one job at `docs/handoffs/<area>/<job>/<job>.md`. `<area>` is the job's `area`, the part of Velnora it belongs to (`product`, `platform`, `devops`, `libraries`, `docs`, `departments`), and `<job>` is a kebab-case name such as `kernel-server-startup`, unique across all areas.
- A **handoff** is the report of one piece of work by one role or session, at `docs/handoffs/<area>/<job>/<yyyy-mm-dd>-<role>-<topic>.md`.
- A **compacted handoff** folds ten of a job's handoffs into one note, at `docs/handoffs/<area>/<job>/<from>--<to>-compacted-<topic>.md`. `<from>` and `<to>` are the dates of the oldest and newest handoff it folds, so it sorts in place among the dated handoffs.
- New notes start from the matching template in `docs/templates/` (`job.md`, `handoff.md`, `compacted-handoff.md`), which Obsidian's Templates plugin also uses.

## Before working

- Before any work on a job, read its job note, then its handoffs from oldest to newest, compacted handoffs included. Start from the job note's "Current state" and read at least every handoff it points at as still relevant.
- Treat what the job note and handoffs settle as settled. Never ask again a question a handoff already answers, and only ask the questions they leave open.
- Read the issue itself on GitHub, not from a note. When GitHub can't be reached, say so and wait instead of working from memory of the issue.
- When the work has no job yet, create the job folder under its area and its job note first. When it is unclear which job or area the work belongs to, ask instead of guessing.

## While working

- Every piece of work writes one handoff, a direct session outside the pipeline included. Create it when the work starts and update it as the work goes.
- One handoff per role per task. When you come back to the same task on the same pull request, in this session or a later one, update your own latest handoff for it instead of writing another: widen what was asked, add what you did, why and the checks you ran, and bring "Where it stands" and "Next" up to date. A new handoff starts only with a different task, or after the pull request has merged.
- Commit the handoff together with the work it describes, so git never holds work without its record. When a session ends mid-work, the committed handoff's "Where it stands" and "Next" are where the next session picks up.
- A role that cannot write files returns its handoff, in the template's shape, as its reply, and whoever started it writes the file and commits it.
- When the work ends, set the handoff's `status`, and bring the job note's "Current state", `tasks` and `updated` up to date.
- Never rewrite a handoff once its pull request has merged. A correction after that is a new handoff that links the one it corrects. Compacting is the one exception.

## Compacting

- When a job holds more than ten handoffs that no compacted handoff folds yet and whose pull requests have all merged, whoever works on the job next folds the oldest ten into one compacted handoff before starting its own work. Commit the compaction on its own, on the task branch of that work.
- Never fold a handoff whose pull request is still open, and never fold a compacted handoff again.
- The compacted handoff keeps every decision with its reason and the alternatives that lost, what was built and where it lives, and every question still open at the newest folded handoff. It drops the step-by-step story and the checks that passed.
- Delete the folded handoffs in the same commit. Git keeps them: `git log -- <path>` finds each one by the name listed in `folds`.
- Point every link to a folded handoff at the compacted handoff instead, in the job note, other handoffs, rules and `STATUS.md` alike. A link fix is not a rewrite.
- In the job note's "How it got here", replace the folded handoffs' story with a short paragraph that links the compacted handoff.

## Writing

- The body is a detailed report in plain paragraphs under the template's headings, not bullet lists: what was asked, what was done and how, why this way and which alternatives lost, which checks ran, where things stand, and what comes next.
- In the body, the first mention of a task in each section links its issue, such as `[#42](https://github.com/Velnora/velnora/issues/42)`. The first mention of a job, handoff or library in each section is a relative markdown link.
- In frontmatter, a job is a quoted wikilink, such as `job: "[[kernel-server-startup]]"`, since that is the form Obsidian reads as a link inside properties. A task is its quoted issue URL.
- Describe what an issue asks only as far as the work needs, in your own words; never copy an issue's text into a note.
- A check that failed stays in the note as a failure, with its output summarised. Never report a check you didn't run.
- Never put a secret in any of these notes.
- Every file name under `docs/` is unique, since Obsidian finds notes by name: no `README.md` under `docs/handoffs/`.

## Required frontmatter

A note missing any of these fields, or using a value outside the allowed ones, is not finished.

| Note      | Field     | Holds                                                                  |
| --------- | --------- | ---------------------------------------------------------------------- |
| job       | `type`    | `job`                                                                  |
| job       | `area`    | The part of Velnora it belongs to, also its folder, such as `platform` |
| job       | `status`  | `planned`, `in progress` or `done`                                     |
| job       | `tasks`   | Its GitHub issues, as quoted issue URLs                                |
| job       | `updated` | The date its "Current state" was last brought up to date               |
| handoff   | `type`    | `handoff`                                                              |
| handoff   | `job`     | The job it worked on, as a quoted wikilink                             |
| handoff   | `tasks`   | The issues it served, as quoted URLs, empty for work asked in chat     |
| handoff   | `role`    | The department role, such as `core-engineer`, or `session` outside it  |
| handoff   | `model`   | The exact model ID that did the work                                   |
| handoff   | `date`    | The date the work started                                              |
| handoff   | `status`  | `done`, `partial` or `blocked`                                         |
| handoff   | `branch`  | The branch the work was committed on                                   |
| handoff   | `pr`      | The pull request number, empty until one is opened                     |
| compacted | `type`    | `compacted-handoff`                                                    |
| compacted | `job`     | The job whose handoffs it folds, as a quoted wikilink                  |
| compacted | `tasks`   | Every issue the folded handoffs served, as quoted URLs                 |
| compacted | `from`    | The `date` of the oldest handoff it folds                              |
| compacted | `to`      | The `date` of the newest handoff it folds                              |
| compacted | `folds`   | The folded handoffs' file names, quoted, oldest first                  |
| compacted | `prs`     | The pull request numbers of the folded handoffs                        |
| compacted | `model`   | The exact model ID that compacted them                                 |
| compacted | `date`    | The date the handoffs were compacted                                   |
