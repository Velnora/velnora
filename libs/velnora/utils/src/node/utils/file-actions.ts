import merge from "lodash.merge";

import * as constants from "node:constants";
import { access, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { basename, dirname, extname, relative } from "node:path";

import { format } from "prettier";

import { type JsonMergeInput, isMergeCallback } from "./is-merge-callback";
import { fileToParser, prettierConfig } from "./prettier";

const fileContentCache = new Map<string, string>();

export const fileActions = (path: string) => {
  return {
    // region File actions
    async create() {
      if (await this.exists()) return;
      await mkdir(dirname(path), { recursive: true });
      await writeFile(path, "");
    },
    async createDir() {
      await mkdir(path, { recursive: true });
    },
    async read() {
      if (!fileContentCache.has(path)) {
        const content = await readFile(path, "utf-8");
        fileContentCache.set(path, content);
      }
      return fileContentCache.get(path)!;
    },
    async readJson<TJson extends object>() {
      const raw = await this.read();
      if (!raw.trim()) return {} as TJson;
      return JSON.parse(raw) as TJson;
    },
    async write(content: string) {
      !(await this.exists()) && (await this.create());
      const formattedContent = await this.format(content);
      fileContentCache.set(path, formattedContent);
      await writeFile(path, formattedContent);
    },
    async writeJson<TJson extends object>(content: TJson) {
      await this.write(JSON.stringify(content, null, 2));
    },
    async delete() {
      await rm(path, { recursive: true });
    },
    async extendJson<TJson extends object>(patchOrCallback: JsonMergeInput<TJson>) {
      const existing = (await this.exists()) ? await this.readJson<TJson>() : ({} as TJson);
      let result: TJson;

      if (isMergeCallback(patchOrCallback)) {
        const updated = patchOrCallback(existing);
        result = merge({}, existing, updated || {});
      } else {
        result = merge({}, existing, patchOrCallback);
      }

      await this.writeJson(result);
    },
    // endregion

    // region Path actions
    relative(to: string) {
      return relative(dirname(path), to);
    },
    get fixed() {
      return path;
    },
    get dirname() {
      return dirname(path);
    },
    async exists() {
      try {
        await access(path, constants.F_OK);
        return true;
      } catch {
        return false;
      }
    },
    // endregion

    // region File content handlers
    async format(content?: string) {
      const fileContent = content || (await this.read());
      const ext = extname(this.fixed).slice(1).toLowerCase();
      const base = basename(this.fixed, extname(this.fixed));
      const parser = fileToParser[ext] || fileToParser[base];

      try {
        if (!parser) throw "";
        return await format(fileContent, { parser, filepath: path, ...prettierConfig });
      } catch (err) {
        console.warn(`Prettier failed to format ${this.fixed}:`, err);
        return fileContent;
      }
    }

    // endregion
  };
};

export type FileActions = ReturnType<typeof fileActions>;
