import { pathConstructor } from "./path-constructor";

export const projectFs = pathConstructor(process.cwd(), efn => ({
  cache: efn.f<[cachePath: string]>()(efn => ({
    apps: efn.f<[appsDir: string]>()(efn => ({
      app: efn.f<[app: string]>()(efn => ({
        exposedModule: (module: string) => efn.fs("exposed-modules", `${module}.ts`)
      }))
    })),
    tsconfig: efn.fs("tsconfig.json")
  }))
}));
