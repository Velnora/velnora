* Hooks: `configure → scaffold → build → runtime`.
* Context **capabilities** API: `provide()`, `require()`, `has()`.
* Context **entrypoints** API: `entrypoints.server.add()`, `entrypoints.client.add()`.
* Context **vite** API: `use(factory, options?, order?)`, `define(aliases)`, `virtual(id, code)`.
* Context **pkg** API: `addRuntime()`, `addDev()`, `addPeer()`, `setScript()`, `patchJson()`.
* **Transactions**: host snapshots between stages; hooks must be pure w.r.t. side-effects (host applies them).

**Done when:** every method has a one-liner purpose and a micro example (inline, not runnable).
