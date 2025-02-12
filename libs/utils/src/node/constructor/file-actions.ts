import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";

import type { FileActions } from "@fluxora/types/utils";

export const fileActions = (path: string): FileActions => {
  path = resolve(path);

  return {
    // region File actions
    async create() {
      await mkdir(dirname(path), { recursive: true });
      await writeFile(path, "");
    },
    async createDir() {
      await mkdir(path, { recursive: true });
    },
    async read() {
      return readFile(path, "utf-8");
    },
    async readJson<TJson extends object>() {
      return JSON.parse(await this.read()) as TJson;
    },
    async write(content: string) {
      await this.create();
      await writeFile(path, content);
    },
    async writeJson<TJson extends object>(content: TJson) {
      await this.write(JSON.stringify(content, null, 2));
    },
    async delete() {
      await rm(path, { recursive: true });
    },
    // endregion

    // region Path actions
    relative(to: string) {
      return relative(dirname(path), to);
    },
    fixed() {
      return path;
    },
    dirname() {
      return dirname(path);
    }
    // endregion
  };
};
