# Technical gate verdict

The architect's half of the gate. The plan goes ahead only when this and the [product gate verdict](../../product/templates/product-gate-verdict.md) both approve it.

```md
🤖 Core architect: <Approved | Rejected | Questions for the maintainer> for <issue URL or "chat request">, attempt <n>

**Plan checked:** <the plan's author and attempt>

**Checked:**

- **Rules:** <yes / no: the plan follows the workspace rules for every file it touches>
- **Boundaries:** <yes / no: each file is changed by its owner, and no new import crosses a package or generation the plan doesn't name>
- **Contracts:** <yes / no: every contract change is named with its consumers>
- **Tests:** <yes / no: each changed behaviour has a spec in the plan>
- **One reviewable PR:** <yes / no, with the estimated files and lines>

**Size and route:** <S, M or L, and the roles the route needs, security included when a trust boundary moves>

**To pass, if rejected:** <what the plan must change>

**Questions for the maintainer, if any:**

1. <the question, the alternatives and a recommendation>
```
