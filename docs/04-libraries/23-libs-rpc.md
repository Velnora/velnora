---
title: "@velnora/rpc"
prev: "[[22-libs-integrations-microfrontend]]"
next: "[[24-libs-runtime-client]]"
covers:
  - libs/rpc
---

# @velnora/rpc

`@velnora/rpc`, at `libs/rpc/`, is reserved for calls between apps and between an app's client and its server. Its `src/main.ts` is `export default {};` and nothing else, and it has no dependencies. When RPC is designed, its handlers are a trust boundary, so [the security role](../departments/reliability/roles/security/README.md) reviews them.

The last package, [`@velnora/runtime-client`](24-libs-runtime-client.md), is empty in the same way.
