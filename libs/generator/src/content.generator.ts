import type { PackageJson } from "type-fest";

import type { Package } from "@fluxora/types/core";
import { projectFs } from "@fluxora/utils/node";

export const contentGenerator = async (): Promise<void> => {
  await projectFs.cache.gitignore.write(["*", ".*"].join("\n") + "\n");
  await projectFs.cache.packageJson.writeJson<PackageJson>({ type: "module" });
  await projectFs.cache.template.packageJson.writeJson<PackageJson>({ type: "module" });
  await projectFs.cache.tsconfigJson.writeJson({
    extends: projectFs.cache.tsconfigJson.relative(projectFs.tsconfigJson.$raw),
    compilerOptions: { allowImportingTsExtensions: true }
  });
};

contentGenerator.app = async (app: Package) => {
  const appFs = projectFs.cache.app(app.name);

  // await appFs.appConfig.writeJson(appManager.getApp(app.name).config!);
  await appFs.packageJson.writeJson<PackageJson>({ type: "module" });
};

contentGenerator.lib = async (lib: Package) => {
  const appFs = projectFs.cache.lib(lib.name);

  // await appFs.appConfig.writeJson(appManager.getApp(app.name).config!);
  await appFs.packageJson.writeJson<PackageJson>({ type: "module" });
};

contentGenerator.postScripting = async () => {
  // const fs = projectFs(config.fluxoraRoot);
  // const appFs = fs.cache.app(config.app.name);
  //
  // const appConfig = await appManager.app().loadAppConfig(config.app);
  //
  // const paths: NonNullable<NonNullable<TsConfigJson["compilerOptions"]>["paths"]> = {};
  //
  // const promises = config.apps
  //   .filter(app => app.name !== config.app.name)
  //   .map(async microApp => {
  //     const appConfig = await loadAppConfig(microApp);
  //     const appFs = fs.cache.app(microApp.name);
  //     paths[appConfig.name] = Object.values(appConfig.exposedModules).map(paths =>
  //       appFs.types.declarationDts.relative(paths)
  //     );
  //
  //     for (const [module, path] of Object.entries(appConfig.exposedModules)) {
  //       paths[`${appConfig.name}/${module}`] = [appFs.types.declarationDts.relative(path)];
  //     }
  //   });
  //
  // await Promise.all(promises);
  //
  // await appFs.tsconfigJson.writeJson<TsConfigJson>({
  //   extends: appFs.tsconfigJson.relative(fs.tsconfigJson.$raw),
  //   compilerOptions: { baseUrl: ".", paths, moduleResolution: "node" }
  //   // include: config.apps
  //   //   .filter(app => app.name !== config.app.name)
  //   //   .map(app => appFs.tsconfigJson.relative(fs.app(app.name).tsconfigJson.$raw))
  // });
  //
  // const declFile = appFs.types.declarationDts;
  //
  // const content = [
  //   `declare module "${config.app.name}" {`,
  //   ...Object.entries(appConfig.exposedModules).map(([module]) => `  export * from "${config.app.name}/${module}";`),
  //   "}",
  //   "",
  //
  //   ...Object.entries(appConfig.exposedModules).flatMap(([module, path]) => [
  //     `declare module "${config.app.name}/${module}" {`,
  //     `  export * from "${declFile.relative(path)}";`,
  //     "}",
  //     ""
  //   ])
  // ]
  //   .join("\n")
  //   .trimStart();
  //
  // await declFile.write(content);
};
