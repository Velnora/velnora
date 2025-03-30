import { readFile } from "node:fs/promises";

import type { Promisable } from "type-fest";

import { appCtx } from "../core/page-context";

const handleErrorPartWithKnownFile = async (
  file: string,
  lineNumber: number,
  columnNumber: number,
  errorPartLength: number,
  cb: (reference: string, context: string[]) => Promisable<void>
) => {
  const fileContent = await readFile(file, "utf-8");
  const lines = fileContent.split("\n");

  const context =
    lineNumber < 3
      ? lines.slice(0, 5)
      : lineNumber < lines.length - 2
        ? lines.slice(-5)
        : lines.slice(lineNumber - 2, lineNumber + 3);

  context.splice(
    lineNumber - Math.max(0, lineNumber - 2) + 1,
    0,
    " ".repeat(columnNumber) + "^".repeat(errorPartLength)
  );

  await cb(`${file}:${lineNumber + 1}:${columnNumber + 1}`, context);
};

const handleErrorPart = async (
  file: string,
  errorPart: string,
  cb: (reference: string, context: string[]) => Promisable<void>
) => {
  const fileContent = await readFile(file, "utf-8");
  const lines = fileContent.split("\n");
  const lineNumber = lines.findIndex(line => line.includes(errorPart));

  if (lineNumber === -1) return null;
  const columnNumber = lines[lineNumber].indexOf(errorPart);
  await handleErrorPartWithKnownFile(file, lineNumber, columnNumber, errorPart.length, cb);
};

export const sendErrorToClient = async (error: any) => {
  appCtx.vite.server.ssrFixStacktrace(error);

  let m: RegExpMatchArray | null;
  if ((m = error.message.match(/^Cannot find module '(.+)' imported from '(.+)'$/))) {
    const [, module, path] = m;
    await handleErrorPart(path, module, (reference, context) => {
      const oldStack = error.stack;
      error = new Error(error.message);
      error.stack = [reference, ...context, "", oldStack].join("\n");
    });
  }

  if (m) {
    appCtx.vite.server.ws.send({
      type: "error",
      err: {
        message: error.message,
        stack: error.stack || "No stack trace available"
      }
    });
  }
};
