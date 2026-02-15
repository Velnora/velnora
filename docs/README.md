# Documentation guidelines

- **ADRs:** half a page is fine. Write them conversationally ("We decided to…").
- **Specs:** concrete but code-free. Use TypeScript snippets for type shapes.
- **Checklists:** bullet points only.
- **Don't document code** — document contracts, rules, and flows.

## Structure

```
docs/
  00-overview.md          Architecture and project model
  10-runtime.md           Kernel lifecycle, Host, project discovery
  iteration-log.md        Chronological decision / milestone log
  spec/
    config.md             Configuration schema and resolution
    dev-command.md         velnora dev — CLI surface and execution flow
  adr/
    0001-package-roles.md Package boundaries and dependency direction
  checklists/
    v01-acceptance.md     v0.1 release criteria
```
