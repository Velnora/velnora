# Product gate verdict

The analyst's half of the gate. The plan goes ahead only when this and the [technical gate verdict](../../core/templates/technical-gate-verdict.md) both approve it.

```md
🤖 Product analyst: <Approved | Rejected | Questions for the maintainer> for <issue URL or "chat request">, attempt <n>

**Plan checked:** <the plan's author and attempt>

**Checked:**

- **Does what the brief asks:** <yes / no, naming any "done when" item the plan misses>
- **No more than asked:** <yes / no, naming any step beyond the brief>
- **Fits the product:** <yes / no>
- **Keeps public promises:** <yes / no: no public API, CLI command or config option changes without the issue asking>

**To pass, if rejected:** <what the plan must change>

**Questions for the maintainer, if any:**

1. <the question, the alternatives and a recommendation>
```
