# Security review

What the security role returns for a change that moves a trust boundary.

```md
🤖 Reliability security: <Approved | Changes requested> for <issue URL or "chat request">, attempt <n>

**Reviewed:** <the commits, from the first hash to the last>

**Boundaries touched:** <request handling, user input, executed code, dependencies, publish surface: each the change touches>

**Checked:**

- **Input:** <yes / no / not touched: paths, headers and bodies from outside are validated before use>
- **Execution:** <yes / no / not touched: only the user's own config and code are executed, from where they are expected>
- **Dependencies:** <yes / no / not touched: each new dependency is needed, maintained and has no known advisory>
- **Publish surface:** <yes / no / not touched: the package publishes only its build output and declared files>
- **Secrets:** <yes / no: no secret in code, tests, logs or docs>

**Findings, if any:**

1. `<file>:<line>`: <the risk, and how it could be used>. To pass: <what would fix it>
```
