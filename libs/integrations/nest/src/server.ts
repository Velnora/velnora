import type { Type } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import { defineServerSetup } from "@velnora/plugin-api";
import type { BackendHandler } from "@velnora/types";

import { createLogger } from "./utils/create-logger";

export const setupServer = defineServerSetup<Type>(async (AppModule, ctx) => {
  const adapter = new ExpressAdapter();
  const logger = createLogger(ctx.logger);
  const app = await NestFactory.create(AppModule, adapter, { logger });
  app.enableShutdownHooks();
  await app.init();

  return {
    handler: app.getHttpAdapter().getInstance() as BackendHandler,
    async dispose() {
      await app.close();
    }
  };
});
