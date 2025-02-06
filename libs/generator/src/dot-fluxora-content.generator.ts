import type { PackageJson, TsConfigJson } from "type-fest";

import { appManager } from "@fluxora/common";
import type { FluxoraApp, FluxoraConfig, FluxoraConfigMethods } from "@fluxora/types/core";
import { capitalize } from "@fluxora/utils";
import { projectFs } from "@fluxora/utils/node";

export const dotFluxoraContentGenerator = async (): Promise<void> => {
  // const fs = projectFs(config.fluxoraRoot);
  //
  // await fs.cache.gitignore.write(["*", ".*"].join("\n") + "\n");
  // await fs.cache.packageJson.writeJson<PackageJson>({ type: "module" });
  // await fs.cache.tsconfigJson.writeJson({
  //   extends: fs.cache.tsconfigJson.relative(fs.tsconfigJson.$raw),
  //   compilerOptions: { allowImportingTsExtensions: true }
  // });
};

dotFluxoraContentGenerator.app = async () => {
  // const fs = projectFs(config.fluxoraRoot);
  // const appFs = fs.cache.app(config.app.name);
  //
  // const appConfig = {
  //   name: config.app.name,
  //   componentName: capitalize(config.app.name),
  //   exposedModules: Object.fromEntries(Array.from(config.exposedModules.entries()).map(([key, value]) => [value, key]))
  // };
  // appMapping.set(config.app.name, appConfig);
  // await appFs.appConfig.writeJson(appConfig);
  // await appFs.packageJson.writeJson<PackageJson>({ type: "module" });
};

dotFluxoraContentGenerator.postScripting = async () => {
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
