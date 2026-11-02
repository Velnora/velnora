# Nx Task Rules

- Prefer running build, lint, test, e2e, and similar workspace tasks through Nx rather than directly through the underlying tooling.
- Prefix Nx commands with the workspace package manager instead of relying on a globally installed CLI.
- For workspace navigation, project relationships, targets, and dependencies, use Nx-aware workspace tooling when available.
- Verify unfamiliar Nx CLI flags before using them; do not guess flags.
- For scaffolding, use the appropriate Nx generator workflow rather than manually inventing project structure when a generator is intended.
- Use Nx documentation for advanced configuration, unfamiliar flags, migrations, plugin configuration, and edge cases rather than for routine syntax already known from the workspace.
