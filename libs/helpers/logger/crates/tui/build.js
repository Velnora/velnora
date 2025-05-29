await Bun.build({
  entrypoints: ["index.js"],
  outdir: "build",
  target: "node",
  format: "esm"
});
