import { getModuleString } from "@velnora/devkit/node";
import { defineIntegration } from "@velnora/plugin-api";

import pkg from "../package.json";

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const nest = defineIntegration(() => {
  return {
    name: "@velnora/integration-nest",

    apply(ctx) {
      return (
        ctx.fs.exists(`server/{app,${ctx.app.basename}}.module.{js,ts}`) &&
        ctx.pkg.ensurePackage("@nestjs/common", "^11") &&
        ctx.pkg.ensurePackage("@nestjs/core", "^11")
      );
    },

    configure(ctx) {
      ctx.fs.pushd("server");

      const entryFiles = ctx.fs.glob(`{app,${ctx.app.basename}}.module.{js,ts}`);
      if (entryFiles.length === 0) {
        ctx.logger.error("Could not find entry file for React app. Skipping React (client) integration.");
        ctx.fs.popd();
        return;
      }

      if (entryFiles.length > 1) {
        ctx.logger.warn("Multiple entry files found for React app. Using the first one found.");
      }

      const modulePath = ctx.fs.resolve(entryFiles[0]!);
      const appModuleVirtualId = ctx.vite.virtual(
        "nest/app-module",
        getModuleString(modulePath, [`${capitalize(ctx.app.basename)}Module`, "AppModule"])
      );

      const entryVirtual = ctx.vite.entryServer(
        `
import AppModule from "${appModuleVirtualId}";
import { setupServer } from "${pkg.name}/server";
export default setupServer(AppModule);
`
      );

      // const environment = ctx.runtimes.get(ctx.app).createEnvironment(ctx.app);
      const envId = ctx.vite.addServerEnvironment({
        build: { ssr: true, lib: { entry: { main: entryVirtual }, formats: ["es"] } },
        define: { __NESTJS_PLATFORM_SERVER__: true },
        resolve: { conditions: ["node", "module", "development"] }
      });

      ctx.router.registerBackend({
        environment: envId,
        entry: entryVirtual,
        runtime: ""
      });
    },

    scaffold(ctx) {
      // if (!ctx.fs.exists("apps/server/src/main.ts")) {
      //   ctx.fs.ensureDir("apps/server/src");
      //   ctx.fs.ensureFile(
      //     "apps/server/src/app.module.ts",
      //     `
      //   import { Module } from '@nestjs/common';
      //   @Module({ imports: [], providers: [], controllers: [] })
      //   export class AppModule {}
      // `
      //   );
      //   ctx.fs.ensureFile(
      //     "apps/server/src/main.ts",
      //     `
      //   import 'reflect-metadata';
      //   import { NestFactory } from '@nestjs/core';
      //   import { AppModule } from './app.module';
      //   async function bootstrap(){
      //     const app = await NestFactory.create(AppModule);
      //     await app.listen(process.env.NEST_PORT || 3000);
      //   }
      //   bootstrap();
      // `
      //   );
      // }
    },

    build(ctx) {
      // ctx.pkg.addRuntime({
      //   "@nestjs/common": "^10.3.0",
      //   "@nestjs/core": "^10.3.0",
      //   "reflect-metadata": "^0.2.2",
      //   "rxjs": "^7.8.1"
      // });
      // ctx.pkg.addDev({ tslib: "^2.6.3" });
      //
      // ctx.pkg.patchJson("tsconfig.json", {
      //   compilerOptions: { experimentalDecorators: true, emitDecoratorMetadata: true }
      // });
      //
      // // If a React SSR handler exists, wire it into Nest AppModule via AST (no string hacking)
      // if (ctx.capabilities.has("ui:render:ssr")) {
      //   ctx.fs.ensureFile(
      //     "apps/server/src/react-ssr.ts",
      //     `
      //   export async function render(url: string){ /* adapter → stream/string */ return "<!doctype html>...</html>"; }
      // `
      //   );
      //   ctx.ast.tsInjectImport({
      //     file: "apps/server/src/app.module.ts",
      //     importName: "Module",
      //     from: "@nestjs/common",
      //     isDefault: false
      //   });
      //   ctx.ast.tsAddToNgModule({
      //     file: "apps/server/src/app.module.ts",
      //     arrayName: "providers",
      //     exprCode: `{ provide: 'HTTP_SSR_HANDLER', useValue: (url: string) => import('./react-ssr').then(m => m.render(url)) }`,
      //     uniqueKey: "HTTP_SSR_HANDLER"
      //   });
      // }
    },

    runtime(ctx) {
      // ctx.log.info("Nest runtime: HTTP server available.");
    }
  };
});
