import { spawn } from "node:child_process";

const runCommand = (command, args = [], options = {}) => {
  const { promise, resolve } = Promise.withResolvers();
  const child = spawn(command, args, { stdio: "inherit", shell: true, ...options });

  child.on("exit", code => {
    if (code > 0) process.exit(code);
    resolve();
  });

  return promise;
};

await runCommand("napi", ["build", "--platform", "--release"]);

await Bun.build({
  entrypoints: ["index.js"],
  outdir: "build",
  target: "node",
  format: "esm"
});
