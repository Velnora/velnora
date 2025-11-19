* **Provided**: `http:server`, `nest:di`, `ui:framework`, `ui:routes`, `ui:render:csr`, `ui:render:ssr`, `build:vite-plugin`.
* **Rules**:
    * At most **one** `http:ssr` entrypoint **per appSchema**.
    * UI SSR **requires** `http:server`.
    * Vite plugins are ordered (default 100; higher runs later).

**Done when:** a table shows which package/integrationSchema typically **provides** or **requires** each capability.
