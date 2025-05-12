import { appCtx } from "@velnora/runtime";
import { pathConstructor } from "@velnora/utils/node";

export const generateProjectFs = (root = process.cwd()) => {
  return pathConstructor(root, c => ({
    dot: c.fs("."),
    apps: c.fs(appCtx.projectStructure.apps.rawRoot, c => ({
      app(name: string) {
        return c.fs(name, c => ({
          client: c.e("client", c => ({
            app: c.e("app", c => ({
              page: c.fs("page.tsx")
            })),
            routes: c.fs("routes.ts")
          })),
          server: c.e("server", c => ({
            controller: c.fs(`${name}.controller.ts`),
            service: c.fs(`${name}.service.ts`),
            module: c.fs(`${name}.module.ts`)
          })),
          packageJson: c.fs("package.json"),
          tsconfig: c.fs("tsconfig.json")
        }));
      }
    })),
    libs: c.fs(appCtx.projectStructure.libs.rawRoot, c => ({
      lib(name: string, jsx = false) {
        return c.fs(name, c => ({
          src: c.e("src", c => ({
            main: c.fs(`main.ts${jsx ? "x" : ""}`)
          })),
          packageJson: c.fs("package.json"),
          tsconfig: c.fs("tsconfig.json")
        }));
      }
    })),
    template: c.fs(appCtx.projectStructure.template.rawRoot, c => ({
      src: c.e("src", c => ({
        main: c.fs("main.ts")
      }))
    })),
    prettier: c.fs(".prettierrc"),
    env: c.fs(".env"),
    packageJson: c.fs("package.json"),
    tsconfig: c.fs("tsconfig.json"),
    velnoraConfig: c.fs("velnora.config.ts"),
    velnoraEnv: c.fs("velnora-env.d.ts")
  }));
};

export type GeneratedProjectFs = ReturnType<typeof generateProjectFs>;
