import debugFn from "debug";

debugFn.inspectOpts = { colors: true, depth: null };
export const debug = debugFn("velnora:vite");
