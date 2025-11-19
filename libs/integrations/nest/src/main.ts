import { defineIntegration } from "@velnora/plugin-api";

export const nest = defineIntegration(() => {
  return {
    name: "@velnora/integration-nest",
    supportsHost: "nest",
    priority: { build: 40, runtime: 10 },

    apply(ctx) {
      return (
        (ctx.fs.exists("server/app.module.{js,ts}") || ctx.fs.exists(`server/${ctx.app.name}.module.{js,ts}`)) &&
        ctx.pkg.ensurePackage("@nestjs/common", "^11") &&
        ctx.pkg.ensurePackage("@nestjs/core", "^11")
      );
    },

    configure(ctx) {
      ctx.fs.pushd("server");

      const virtualId = ctx.vite.virtual(
        "entry/server",
        `
import "reflect-metadata";
console.log(123);
`
      );

      // const environment = ctx.runtimes.get(ctx.app).createEnvironment(ctx.app);
      ctx.vite.addEnvironment("server", {
        build: { ssr: true, lib: { entry: { main: virtualId }, formats: ["es"] } },
        define: { __NESTJS_PLATFORM_SERVER__: true },
        resolve: { conditions: ["node", "module", "development"] },
        consumer: "server"
      });

      // ctx.backends.use(ctx.app, runtime);
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
