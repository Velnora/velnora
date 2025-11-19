* CLI → `@velnora/core.createDevServer(opts)`.
* Core responsibilities:
    1. load config; 2) resolve integrations; 3) run hooks by stage;
    2. feed Vite composer; 5) assemble server bootstrap; 6) start server; 7) link HMR.
* Outputs (for M1):
    * **Dry-run plan** logs: deps added, vite plugins (ordered), entrypoints registered.
    * Health log: which appSchema has SSR vs CSR; which port; which middlewares loaded.

**Done when:** you have a single “happy-path” sequence diagram in the doc.
