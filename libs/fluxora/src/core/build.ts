// import { appManager } from "../../../../old/libs/common/src/main";
// import { logger } from "../../../../old/libs/core/src/utils/logger";
// import { contentGenerator } from "../../../../old/libs/generator/src/main";
// import { build as viteBuild } from "../../../../old/libs/vite/src/main";

export const build = async () => {
  // await contentGenerator();
  // await appManager.resolveUserConfig();
  // await appManager.resolvePackages(true);
  //
  // const apps = appManager.getApps();
  // const libs = appManager.getLibs();
  // const template = appManager.getTemplateApp();
  //
  // const contentGeneratorPromises = [
  //   ...apps.map(app => contentGenerator.app(app)),
  //   ...libs.map(lib => contentGenerator.lib(lib))
  // ];
  // await Promise.all(contentGeneratorPromises);
  //
  // logger.info("Compiling apps, libs and template...");
  // const promises = [
  //   ...apps.map(app => viteBuild(app, true)),
  //   ...libs.map(lib => viteBuild(lib)),
  //   await viteBuild(template)
  // ];
  //
  // await Promise.all(promises);
  // logger.info("Building apps...");
  // await Promise.all(apps.map(app => viteBuild(app)));
};
