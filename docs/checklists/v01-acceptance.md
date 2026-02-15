# v0.1 — Kernel Skeleton — Acceptance checklist

Derived from the [Notion release spec](https://www.notion.so/2f8e8c1995e58001a426e65e9d5f1407).

## Functional requirements

- [x] Workspace root is detected from any subdirectory
- [x] Projects are discovered via workspace globs
- [x] `velnora dev` starts the Host on `localhost:3000`
- [ ] `velnora init` creates a valid `velnora.config.ts`
- [ ] Zero-config mode works (no config file needed)
- [ ] Built-in static adapter implements the Adapter Protocol
- [ ] Browser can access the app and all static assets load

## Code quality

- [x] `@velnora/kernel` — builds and stubs via `unbuild`
- [x] `@velnora/host` — builds and stubs via `unbuild`
- [x] `@velnora/cli` — builds and stubs via `unbuild`
- [x] TypeScript types exported correctly from `@velnora/types`
- [x] Kernel has 100 % test coverage
- [ ] All v0.1 tasks marked "Done" in the tracker

## Documentation

- [x] Architecture overview (`docs/00-overview.md`)
- [x] Runtime docs (`docs/10-runtime.md`)
- [x] Config spec (`docs/spec/config.md`)
- [x] Dev command spec (`docs/spec/dev-command.md`)
- [x] Package roles ADR (`docs/adr/0001-package-roles.md`)
- [ ] README with quick-start guide

## Demo validation

The "Hello World" test:

```bash
echo '<h1>Hello Velnora</h1>' > index.html
npx velnora dev
# Open localhost:3000 → See "Hello Velnora"
```
