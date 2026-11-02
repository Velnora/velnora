# Pull request description

What the coordinator writes when it opens the pull request, and keeps current until the maintainer merges it.

```md
## What

<two or three sentences in plain words: what the change does for a Velnora user or contributor>

Closes <#issue number>, or "Asked in chat, no issue".

## Route

<the steps this task went through, and why any usual step was skipped>

## Checks

| Check                     | Result                                              |
| ------------------------- | --------------------------------------------------- |
| `<the exact command run>` | <passed / failed, and whether the failure is known> |

## Reviews

- **Gate:** <the analyst's and the architect's verdicts, in one line each>
- **Owner review:** <each owning role's verdict>
- **Security, if any:** <its verdict>
- **Core reviewer:** <its verdict>
- **QA:** <its verdict>

## Changeset

<the changeset this adds, or why the change needs none>

## For the maintainer, if any

<open questions, risks, or follow-ups recorded as issues>
```
