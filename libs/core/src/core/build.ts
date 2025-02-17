import { appManager } from "@fluxora/common";
import { contentGenerator } from "@fluxora/generator";
import { build as viteBuild } from "@fluxora/vite";

import { logger } from "../utils/logger";

export const build = async () => {
  await contentGenerator();
  await appManager.resolveUserConfig();
  await appManager.resolvePackages(true);

  const apps = appManager.getApps();
  const libs = appManager.getLibs();
  const template = appManager.getTemplateApp();

  const contentGeneratorPromises = [
    ...apps.map(app => contentGenerator.app(app)),
    ...libs.map(lib => contentGenerator.lib(lib))
  ];
  await Promise.all(contentGeneratorPromises);

  logger.info("Compiling apps, libs and template...");
  const promises = [
    ...apps.map(app => viteBuild(app, true)),
    ...libs.map(lib => viteBuild(lib)),
    await viteBuild(template)
  ];

  await Promise.all(promises);

  // logger.info("Building apps...");
  // await Promise.all(apps.map(app => viteBuild(app)));
};
