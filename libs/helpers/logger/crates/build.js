import { spawn } from "node:child_process";

const runCommand = (command, args = [], options = {}) => {
  const { promise, resolve, reject } = Promise.withResolvers();
  const child = spawn(command, args, { stdio: "inherit", shell: true, ...options });

  child.on("exit", code => {
    code === 0 ? resolve() : reject(new Error(`${command} exited with code ${code}`));
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
