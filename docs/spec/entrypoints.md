* **Server kinds:** `http:ssr`, `http:middleware`, `http:controller`, `job:schedule`.
* **Client kinds:** `ui:csr-root`, `ui:ssr-hydrate-root`, `ui:route-manifest`.
* **Shape fields:** `{ id, appSchema, kind, moduleSchema, export?, order?, meta? }`.
* **Constraints:** one `http:ssr` per `{appSchema}`; middleware ordered; controllers must not collide on route+method.

**Done when:** you can describe any integrationSchema by listing the entrypoints it registers.
