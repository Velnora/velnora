# Owner review

What a new run of the owning role returns after reviewing work it didn't write. Every engineering role uses it, and the writer reviews pages with it too.

```md
🤖 <Department> <role>: owner review <Approved | Changes requested> for <issue URL or "chat request">, attempt <n>

**Reviewed:** <the commits, from the first hash to the last>

**Checks run:**

| Command                   | Result                                              |
| ------------------------- | --------------------------------------------------- |
| `<the exact command run>` | <passed / failed, and whether the failure is known> |

**Findings, if any:**

1. `<file>:<line>`: <what is wrong>. To pass: <what would fix it>
```
