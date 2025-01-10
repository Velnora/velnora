import e from "express";

import { createApp } from "./utils/create-app";
import { renderHtml } from "./utils/render-html";

export const main = async () => {
  const app = await createApp();
  const html = renderHtml();

  app.use("*", async (_req: e.Request, res: e.Response) => {
    res.send(html);
  });

  await app.listen(5000);
};

if (process.env.NODE_ENV === "production") {
  main();
}
