import type { RemoteLibrary } from "@fluxora/types/federation";

// @ts-expect-error
import { injectQuery as __vite__injectQuery } from "/@vite/client";

export const get = async (name: string, remoteFrom: string) => {
  let module: any;

  if (typeof window === "undefined") {
    const { createWriteStream, unlink: fsUnlink, mkdtemp: fsMkdtemp } = await import("node:fs");
    const http = await import("node:http");
    const { promisify } = await import("node:util");
    const { join } = await import("node:path");
    const { tmpdir } = await import("node:os");

    const mkdtemp = promisify(fsMkdtemp);
    const unlink = promisify(fsUnlink);

    const promises = Promise.withResolvers<void>();
    const tempDir = await mkdtemp(join(tmpdir(), "module-"));
    const filePath = join(tempDir, "module.js");
    console.log("Downloading", name, "to", filePath);
    const file = createWriteStream(filePath);

    http
      .get(name, response => {
        response.pipe(file);
        file.on("finish", () => {
          file.close(() => promises.resolve());
        });
      })
      .on("error", err => {
        unlink(filePath).catch(() => null); // Clean up if error
        promises.reject(err);
      });

    await promises.promise;

    module = await import(filePath);
    await unlink(filePath);
  } else {
    module = await import(/* @vite-ignore */ __vite__injectQuery(name, "import"));
  }

  return (): RemoteLibrary => {
    if (remoteFrom === "webpack") {
      return Object.prototype.toString.call(module).indexOf("Module") > -1 && module.default ? module.default : module;
    }
    return module;
  };
};
