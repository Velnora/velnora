import { resolve } from "node:path";

import { appCtx } from "@fluxora/runtime";
import { pathConstructor } from "@fluxora/utils/node";

import type { AppCommandOptions } from "../../../cli/src/commands/generate/app";

export const generatedProjectFs = <TRoot extends string>(options: AppCommandOptions) => {
  const root = resolve(appCtx.projectStructure.apps.root, options.name) as TRoot;
  return pathConstructor(root, c => ({
    root: c.fs(process.cwd(), c => ({
      tsconfig: c("tsconfig.json")
    })),
    dot: c.fs("."),
    client: c.e("client", c => ({
      app: c.e("app", c => ({
        page: c.fs("page.tsx")
      })),
      routes: c.fs("routes.ts")
    })),
    server: c.e("server", c => ({
      controller: c.fs(`${options.name}.controller.ts`),
      service: c.fs(`${options.name}.service.ts`),
      module: c.fs(`${options.name}.module.ts`)
    })),
    prettier: c.fs(".prettierrc"),
    packageJson: c.fs("package.json"),
    tsconfig: c.fs("tsconfig.json")
  }));
};

export type GeneratedProjectFs = ReturnType<typeof generatedProjectFs>;
