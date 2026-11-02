---
title: "@velnora/runtime-client"
prev: "[[23-libs-rpc]]"
next: "[[00-getting-started]]"
covers:
  - libs/runtime/client
---

# @velnora/runtime-client

`@velnora/runtime-client`, at `libs/runtime/client/`, is reserved for the browser half of the server runtime, the code that would boot apps on the page. Its `src/main.ts` is `export {};`, and its only other file is a `debug` logger named for it. It depends on `debug`.

That ends the libraries. [Development](../05-development/00-getting-started.md) takes you from a fresh clone to running the workspace's checks.
