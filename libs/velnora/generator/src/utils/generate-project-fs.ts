import { appCtx } from "@velnora/runtime";
import { pathConstructor } from "@velnora/utils/node";

import type { AppCommandOptions } from "../../../cli/src/commands/generate/app";
import type { LibCommandOptions } from "../../../cli/src/commands/generate/lib";

export const generateProjectFs = () => {
  return pathConstructor(process.cwd(), c => ({
    dot: c.fs("."),
    apps: c.fs(appCtx.projectStructure.apps.rawRoot, c => ({
      app(options: AppCommandOptions) {
        return c.fs(options.name, c => ({
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
          packageJson: c.fs("package.json"),
          tsconfig: c.fs("tsconfig.json")
        }));
      }
    })),
    libs: c.fs(appCtx.projectStructure.libs.rawRoot, c => ({
      lib(options: LibCommandOptions) {
        return c.fs(options.name, c => ({
          src: c.e("src", c => ({
            main: c.fs(`main.ts${options.jsx ? "x" : ""}`)
          })),
          packageJson: c.fs("package.json"),
          tsconfig: c.fs("tsconfig.json")
        }));
      }
    })),
    tsconfig: c.fs("tsconfig.json")
  }));
};

export type GeneratedProjectFs = ReturnType<typeof generateProjectFs>;
