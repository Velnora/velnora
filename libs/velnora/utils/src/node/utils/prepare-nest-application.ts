import type { Type } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

export const prepareNestApplication = async (Module: Type, _appName: string) => {
  const app = await NestFactory.create(Module, {});
  app.setGlobalPrefix("/api/v1");
  await app.init();
  return app;
};
