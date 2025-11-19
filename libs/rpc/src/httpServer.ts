// import express from "express";
//
// import type {  } from "@velnora/plugin-api";
//
// type Handler = <TOutput, TInput = unknown>(input: TInput, ctx: VelnoraAppContext) => Promise<TOutput>;
//
// export const mountHttpRpc = (app: express.Express, routes: Record<string, Handler>, ctx: VelnoraAppContext) => {
//   app.post("/rpc/:module/:method", async (req, res) => {
//     const key = `${req.params.module}.${req.params.method}`;
//     const handler = routes[key];
//     if (!handler) return res.status(404).json({ error: "Not found" });
//     try {
//       const out = await handler(req.body, ctx);
//       res.json(out ?? null);
//     } catch (error: unknown) {
//       res.status(500);
//
//       if (error instanceof Error) {
//         res.json({ message: error?.message ?? "Internal error" });
//       }
//
//       res.json({ message: "Internal error", error });
//     }
//   });
// };
