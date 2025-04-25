import { Transform } from "node:stream";

import type { Inject } from "../types/inject";

const compileTag = (tag: Inject): string => {
  if ("html" in tag) {
    return tag.html;
  }

  return `<${tag.tag} ${Object.entries(tag.attrs || {})
    .map(([key, value]) => {
      if (typeof value === "boolean") return value ? key : "";
      return `${key}="${value}"`;
    })
    .join(" ")}>${
    tag.children
      ? (Array.isArray(tag.children) ? tag.children : [tag.children])
          .map(tag => (typeof tag === "string" ? tag : compileTag(tag)))
          .join("")
      : ""
  }</${tag.tag}>`;
};

export const injectHtmlTags = (tagDescriptors: Inject[]) => {
  const { bodyPrepend, body, headPrepend, head } = tagDescriptors.reduce(
    (acc, tag) => {
      switch (tag.injectTo) {
        case "head":
          acc.head.push(tag);
          break;
        case "head-prepend":
          acc.headPrepend.push(tag);
          break;
        case "body":
          acc.body.push(tag);
          break;
        case "body-prepend":
          acc.bodyPrepend.push(tag);
          break;
      }
      return acc;
    },
    {
      head: [] as Inject[],
      headPrepend: [] as Inject[],
      body: [] as Inject[],
      bodyPrepend: [] as Inject[]
    }
  );

  return new Transform({
    transform(chunk, _encoding, callback) {
      const content = chunk
        .toString()
        .replace(/<head>/, (match: string) => `${match}${head.map(compileTag).join("")}`)
        .replace(/<\/head>/, (match: string) => `${headPrepend.map(compileTag).join("")}${match}`)
        .replace(/<body>/, (match: string) => `${match}${body.map(compileTag).join("")}`)
        .replace(/<\/body>/, (match: string) => `${bodyPrepend.map(compileTag).join("")}${match}`);

      callback(null, content);
    }
  });
};
