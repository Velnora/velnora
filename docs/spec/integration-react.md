* Provides: `ui:framework`, `ui:routes`, `ui:render:csr` (always), `ui:render:ssr` (if `mode=ssr`).
* Registers:
    * Client: `ui:csr-root` or `ui:ssr-hydrate-root` (for `{appSchema}`).
    * Server (if SSR): `http:ssr` handler for `{appSchema}`.
* Build: adds `@vitejs/plugin-react` (order 100).

**Done when:** both docs show a table of “hooks → actions → artifacts” (e.g., deps added, entrypoints registered).
