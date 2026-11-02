# QA report

What QA returns after running the change, or after reproducing a bug.

```md
🤖 Reliability qa: <Passed | Failed | Bug reproduced> for <issue URL or "chat request">, attempt <n>

**Tested:** <the commits, from the first hash to the last>

**Checks run:**

| Command                   | Result                                              |
| ------------------------- | --------------------------------------------------- |
| `<the exact command run>` | <passed / failed, and whether the failure is known> |

**Example workspace, if behaviour changed:** <the command, what it printed, and whether that matches the brief's "done when">

**Specs added, if any:** <each spec file and what it covers, with the commit hash>

**Findings, if any:**

1. <the command or file, what is wrong>. To pass: <what would fix it>
```
