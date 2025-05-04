import { capitalize } from "@velnora/utils";

import type { AppCommandOptions } from "../../../cli/src/commands/generate/app";
import type { GeneratedProjectFs } from "../utils/generate-project-fs";
import { logFileSuccess } from "../utils/log-file-success";

export async function applyServerFiles(fs: GeneratedProjectFs, options: AppCommandOptions) {
  const appProjectFs = fs.apps.app(options);

  await appProjectFs.server.controller.write(
    `import { Controller, Get } from "@nestjs/common";

  import { ${capitalize(options.name)}Service } from "./${options.name}.service";

  @Controller("${options.name}")
  export class ${capitalize(options.name)}Controller {
    constructor(private readonly ${options.name}Service: ${capitalize(options.name)}Service) {}

    @Get()
    getHello(): string {
      return this.${options.name}Service.getHello();
    }
  }
  `
  );
  logFileSuccess(fs.apps.relative(appProjectFs.server.controller.$raw));

  await appProjectFs.server.service.write(
    `import { Injectable } from "@nestjs/common";

  @Injectable()
  export class ${capitalize(options.name)}Service {
    getHello(): string {
      return "${options.name} service!";
    }
  }
  `
  );
  logFileSuccess(fs.apps.relative(appProjectFs.server.service.$raw));

  await appProjectFs.server.module.write(
    `import { Module } from "@nestjs/common";

  import { ${capitalize(options.name)}Controller } from "./${options.name}.controller";
  import { ${capitalize(options.name)}Service } from "./${options.name}.service";

  @Module({
    controllers: [${capitalize(options.name)}Controller],
    providers: [${capitalize(options.name)}Service],
  })
  export class ${capitalize(options.name)}Module {}
  `
  );
  logFileSuccess(fs.apps.relative(appProjectFs.server.module.$raw));
}
