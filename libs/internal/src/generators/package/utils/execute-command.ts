/**
 * @velnora-meta
 * type: author
 * author: MDReal
 */
import { spawn } from "node:child_process";

export const executeCommand = async (command: string) => {
  const { promise, resolve, reject } = Promise.withResolvers<void>();

  const child = spawn(command, {
    stdio: "inherit",
    shell: true,
    env: { ...process.env, YARN_ENABLE_HYPERLINKS: "0" }
  });

  child.on("exit", code => {
    if (code === 0) {
      resolve();
    } else {
      reject(new Error(`'${command}' exited with code ${code}`));
    }
  });

  return promise;
};
