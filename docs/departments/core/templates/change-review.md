# Change review

What the core reviewer returns after the owner reviews. The coordinator puts it in the pull request description and, when changes are requested, sends each finding to the role that owns it.

```md
🤖 Core reviewer: <Approved | Changes requested> for <issue URL or "chat request">, attempt <n>

**Reviewed:** <the commits, from the first hash to the last>

**Checked:**

- **Matches the approved plan:** <yes / no, naming any step it skips or goes beyond>
- **Rules:** <yes / no>
- **Boundaries:** <yes / no>
- **Contracts:** <yes / no: no contract changed beyond what the plan named>
- **Tests:** <yes / no: each behaviour the change adds or changes has a spec>
- **Only the task:** <yes / no: nothing unrelated changed>
- **One reviewable PR:** <yes / no, with the changed files and lines>
- **Docs:** <yes / no: the changed pages match the code, and no page the change makes untrue was left>

**Findings, if any:**

1. `<file>:<line>`: <what is wrong>. Breaks <rule or boundary>. To pass: <what would fix it>

**For other reviewers, if any:** <what you noticed for security or release>
```
