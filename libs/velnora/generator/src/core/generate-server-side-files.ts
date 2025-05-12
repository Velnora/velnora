import { capitalize } from "@velnora/utils";

import type { FileLogger } from "../utils/file-logger";
import type { GeneratedProjectFs } from "../utils/generate-project-fs";
import type { GenerateAppOptions } from "./generate-app-files";

export const generateServerSideFiles = async (
  fs: GeneratedProjectFs,
  fileLogger: FileLogger,
  options: GenerateAppOptions
) => {
  const serverFs = fs.apps.app(options.app.name).server;

  await serverFs.module.write(
    `import { Module } from "@nestjs/common";

  import { ${capitalize(options.app.name)}Controller } from "./${options.app.name}.controller";
  import { ${capitalize(options.app.name)}Service } from "./${options.app.name}.service";

  @Module({
    controllers: [${capitalize(options.app.name)}Controller],
    providers: [${capitalize(options.app.name)}Service],
  })
  export class ${capitalize(options.app.name)}Module {}
  `
  );
  fileLogger.created(serverFs.module);

  await serverFs.controller.write(
    `import { Controller, Get } from "@nestjs/common";

  import { ${capitalize(options.app.name)}Service } from "./${options.app.name}.service";

  @Controller("${options.app.name}")
  export class ${capitalize(options.app.name)}Controller {
    constructor(private readonly ${options.app.name}Service: ${capitalize(options.app.name)}Service) {}

    @Get()
    getHello() {
      return this.${options.app.name}Service.getHello();
    }
  }
  `
  );
  fileLogger.created(serverFs.controller);

  await serverFs.service.write(
    `import { Injectable } from "@nestjs/common";

  @Injectable()
  export class ${capitalize(options.app.name)}Service {
    getHello(): string {
      return "${options.app.name} service!";
    }
  }
  `
  );
  fileLogger.created(serverFs.service);
};
