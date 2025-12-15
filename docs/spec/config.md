* Root config keys: `integrations: [ [packageName, options] ]`, `dev.port`, `dev.watch`.
* Per-integrationSchema options (for M1):
    * React: `{ appSchema, mode: "csr" | "ssr" }`
    * Nest: `{ port }`
* Validation lives in `@velnora/types`.

**Done when:** a single example config shows React+Nest (SSR) and Vue (CSR) side-by-side.
