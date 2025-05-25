import { BaseClass, ClassExtensions, ClassGetterSetter, singleton } from "@velnora/utils";
import { useVelnora } from "@velnora/utils/node";

import { RegisteredApp } from "../app-ctx";
import { Entity } from "./entity";

@ClassExtensions()
export class EntityManager extends BaseClass {
  @ClassGetterSetter()
  declare entities: Map<RegisteredApp, Entity>;

  private readonly appNameMap = new Map<string, RegisteredApp>();

  init(app: RegisteredApp) {
    if (this.entities.has(app)) {
      return this.entities.get(app)!;
    }
    const velnora = useVelnora();

    const entity = new Entity(app);
    this.entities.set(app, entity);
    this.appNameMap.set(app.name, app);

    velnora.hooks.hook("velnora:app-server:nestjs:reinit", async appName => {
      const app = this.appNameMap.get(appName);
      if (!app) throw new Error(`App with name ${appName} not found in EntityManager`);
      const entity = this.entities.get(app);
      if (!entity) throw new Error(`Entity for app ${appName} not found in EntityManager`);
      entity.updateServerApp();
    });

    return entity;
  }

  get(app: RegisteredApp) {
    return this.entities.get(app);
  }
}

export const entityManager = singleton(EntityManager);
