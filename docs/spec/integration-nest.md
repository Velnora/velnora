* Provides: `http:server`, `nest:di`.
* Consumes: all `http:ssr`/middleware/controller entrypoints.
* Emits: **internal** bootstrap (no `main.ts` exposed).
* Dev: attaches Vite middleware if running with `vite-integrationSchema`.

**Done when:** both docs show a table of “hooks → actions → artifacts” (e.g., deps added, entrypoints registered).
