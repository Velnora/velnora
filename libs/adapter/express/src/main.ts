import express from "express";

import { type BootstrapFn, HttpAdapterBase } from "@fluxora/adapter-base";
import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";

const nestAdapter = new ExpressAdapter();
const app = express();
const httpAdapter = new HttpAdapterBase(app);

export const boostrap: BootstrapFn = async options => {
  const nestApp = await NestFactory.create(options.AppModule, nestAdapter);
  nestApp.setGlobalPrefix("/api/v1");
  await nestApp.init();

  const appMiddleware = nestApp.getHttpAdapter().getInstance();
  app.use("/api/v1", (req, res, next) => {
    req.url = req.originalUrl;
    appMiddleware(req, res, next);
  });

  return httpAdapter;
};
