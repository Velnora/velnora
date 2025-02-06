import { relative } from "node:path";

import { pathConstructor } from "./constructor/path-constructor";

export const projectFs = (fluxoraCacheRoot: string) => {
  const cacheName = relative(process.cwd(), fluxoraCacheRoot);

  return pathConstructor(process.cwd(), efn => ({
    root: efn.f(""),
    cache: efn.f(cacheName, efn => ({
      app<TAppName extends string>(name: TAppName) {
        return efn.e("apps", name, efn => ({
          appConfig: efn.f("app-config.json"),
          types: efn.e("types", efn => ({
            declarationDts: efn.f(`declaration.d.ts`)
          })),
          packageJson: efn.f("package.json"),
          tsconfigJson: efn.f("tsconfig.json")
        }));
      },
      gitignore: efn.f(".gitignore"),
      packageJson: efn.f("package.json"),
      tsconfigJson: efn.f("tsconfig.json")
    })),
    tsconfigJson: efn.f("tsconfig.json"),
    packageJson: efn.f("package.json")
  }));
};
