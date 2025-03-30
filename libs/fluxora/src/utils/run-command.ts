import { spawn } from "node:child_process";

export const runCommand = (cmd: string, args: string[] = []) => {
  const process = spawn(cmd, args, { stdio: "inherit" });

  process.on("close", code => {
    console.log(`Process exited with code ${code}`);
  });
};
