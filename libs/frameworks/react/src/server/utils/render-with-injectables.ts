import { Transform } from "node:stream";

import type { ReactElement } from "react";
import { RenderToPipeableStreamOptions, renderToPipeableStream } from "react-dom/server";
import type { HtmlTagDescriptor } from "vite";

import { sendErrorToClient } from "@fluxora/utils";

interface RenderWithInjectablesOptions extends RenderToPipeableStreamOptions {
  injections?: HtmlTagDescriptor[];
}

const convertInjectionToHtml = (descriptor: HtmlTagDescriptor): string => {
  const attrsString = Object.entries(descriptor.attrs || {})
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");
  return `<${descriptor.tag}${attrsString ? ` ${attrsString}` : ""}>${
    typeof descriptor.children === "string"
      ? descriptor.children
      : descriptor.children
        ? descriptor.children.map(convertInjectionToHtml)
        : ""
  }</${descriptor.tag}>`;
};

const filterInjections = (injections: HtmlTagDescriptor[]) => {
  return injections.reduce(
    (acc, descriptor) => {
      const arrList =
        descriptor.injectTo === "head"
          ? acc.head
          : descriptor.injectTo === "head-prepend"
            ? acc.bodyPrepend
            : descriptor.injectTo === "body-prepend"
              ? acc.headPrepend
              : acc.body;
      arrList.push(convertInjectionToHtml(descriptor));

      return acc;
    },
    { head: [] as string[], headPrepend: [] as string[], body: [] as string[], bodyPrepend: [] as string[] }
  );
};

export const renderWithInjection = (element: ReactElement, options?: RenderWithInjectablesOptions) => {
  const injections = filterInjections(options?.injections || []);

  const transformStream = new Transform({
    transform(chunk, _encoding, callback) {
      const html = chunk
        .toString()
        .replace(/<head>/, `<head>${injections.headPrepend.join("")}`)
        .replace(/<\/head>/, `${injections.head.join("")}</head>`)
        .replace(/<body>/, `<body>${injections.bodyPrepend.join("")}`)
        .replace(/<\/body>/, `${injections.body.join("")}</body>`);
      this.push(html, "utf-8");
      callback();
    }
  });

  const renderStream = renderToPipeableStream(element, {
    ...options,
    onShellReady() {
      renderStream.pipe(transformStream);
    },
    onError(err, info) {
      if (err instanceof Error) {
        err.stack = info.componentStack;
        sendErrorToClient(err);
        transformStream.end();
      }
    }
  });

  return transformStream;
};
