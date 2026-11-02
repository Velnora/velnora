# Docs report

What the writer returns after writing or repairing pages.

```md
🤖 Knowledge writer: docs for <issue URL or "chat request">, attempt <n>

**Committed:** <the commit hash>

**Pages:**

| Page     | Change                   | Checked against                       |
| -------- | ------------------------ | ------------------------------------- |
| `<path>` | <new / edited / deleted> | <the code or command each claim used> |

**`docs:check`:** <passed, or the problems it printed>

**Left for an owner, if any:**

1. <a claim the code doesn't settle, and the role to ask>
```
