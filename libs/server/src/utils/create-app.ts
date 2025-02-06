import { NestFactory } from "@nestjs/core";

import { LoggerService } from "../services/logger.service";
import { name } from "/@fluxora/virtual/entry/app-config.json";
import { AppModule } from "/@fluxora/virtual/entry/app.module";

export const createApp = async () => {
  const app = await NestFactory.create(AppModule, { logger: new LoggerService(name) });
  app.enableCors();
  app.setGlobalPrefix(`/api/v1/${name}`);
  await app.init();
  return app;
};
