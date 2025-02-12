import { relative } from "node:path";

import { pathConstructor } from "./constructor/path-constructor";

const fixPkgName = (name: string) => name.replace(/^@/g, "__").replace(/[\\\/]/g, "/");

const cacheName = relative(process.cwd(), ".fluxora");
export const projectFs = pathConstructor(process.cwd(), efn => ({
  cache: efn.f(cacheName, efn => ({
    app(name: string) {
      return efn.e("apps", fixPkgName(name), efn => ({
        appConfig: efn.f("app-config.json"),
        vite: efn(".vite"),
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
  app(name: string) {
    return efn.e("apps", fixPkgName(name), efn => ({
      packageJson: efn.f("package.json")
    }));
  },
  lib(name: string) {
    return efn.e("libs", fixPkgName(name), efn => ({
      packageJson: efn.f("package.json")
    }));
  },
  tsconfigJson: efn.f("tsconfig.json"),
  template: efn.f("template", () => ({
    packageJson: efn.f("package.json"),
    tsconfigJson: efn.f("tsconfig.json")
  })),
  packageJson: efn.f("package.json")
}));
