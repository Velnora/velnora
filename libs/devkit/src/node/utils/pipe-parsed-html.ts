import { Transform } from "node:stream";

import { Parser } from "htmlparser2";

export const pipeParsedHtml = (injectionHtml: string): Transform => {
  const headParts: string[] = [];
  const bodyParts: string[] = [];

  // Temporary state for the tag currently being parsed
  let activeTag: {
    name: string;
    fullHtml: string;
    isHead: boolean;
  } | null = null;

  const shredder = new Parser(
    {
      onopentag(name, attrs) {
        const isHead = ["meta", "link", "style"].includes(name);

        // Build the opening tag string
        const attrString = Object.entries(attrs)
          .map(([k, v]) => `${k}="${v}"`)
          .join(" ");
        const openTag = `<${name}${attrString ? " " + attrString : ""}>`;

        if (name === "script" || name === "style") {
          activeTag = { name, fullHtml: `${openTag}`, isHead };
        } else {
          (isHead ? headParts : bodyParts).push(openTag);
        }
      },
      ontext(text) {
        if (activeTag) {
          activeTag.fullHtml += text;
        }
      },
      onclosetag(name) {
        if (activeTag && activeTag.name === name) {
          activeTag.fullHtml += `</${name}>`;
          (activeTag.isHead ? headParts : bodyParts).push(activeTag.fullHtml);
          activeTag = null;
        }
      }
    },
    { decodeEntities: true }
  );

  shredder.write(injectionHtml);
  shredder.end();

  const headInjection = headParts.join("");
  const bodyInjection = bodyParts.join("");

  let headInjected = false;
  let bodyInjected = false;

  return new Transform({
    transform(chunk: Buffer | string, _encoding, callback) {
      let content = chunk.toString();

      // Inject into the flow of the piped HTML
      if (content.includes("</head>")) {
        content = content.replace("</head>", `${headInjection}</head>`);
        headInjected = true;
      }

      if (content.includes("</body>")) {
        content = content.replace("</body>", `${bodyInjection}</body>`);
        bodyInjected = true;
      }

      callback(null, content);
    },

    flush(cb) {
      if (!headInjected) this.push(headInjection);
      if (!bodyInjected) this.push(bodyInjection);
      cb();
    }
  });
};
