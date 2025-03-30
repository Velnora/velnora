import assert from "node:assert";
import { resolve } from "node:path";
import * as process from "node:process";

import type { Adapter } from "@fluxora/adapter-base";
import type { Framework as TFramework } from "@fluxora/framework-base";
import type { Framework } from "@fluxora/types";

import { internalRunnableDevEnvironment } from "../../../../utils/internal-vite-server";
import { projectFs } from "../../../../utils/project-fs";
import { BaseClassContext } from "../../base-class.context";

export class AppsContext extends BaseClassContext {
  private readonly loadedApps = new Set<string>();

  private _exposedModules = new Map<string, Map<string, string>>();

  // region States

  private _apps = new Set<string>();

  /**
   * Get all apps in the set
   */
  get apps() {
    return this._apps;
  }

  /**
   * Get the first app in the set
   */
  get app() {
    return this._apps.values().next().value!;
  }

  /**
   * Add an app to the set
   * @param {string} app
   */
  set app(app: string) {
    this._apps.add(app);
  }

  private _adapter?: Adapter;

  get adapter() {
    return this._adapter;
  }

  get adapterName() {
    return this.pageCtx.userConfig.adapter || "express";
  }

  private _framework?: TFramework;

  get framework() {
    return this._framework;
  }

  get frameworkName() {
    const framework = this.pageCtx.userConfig.framework;
    return framework ? (Array.isArray(framework) ? framework : [framework]) : ["react" as Framework];
  }

  private _activeApp?: string;

  get activeApp() {
    return this._activeApp;
  }

  set activeApp(app) {
    this._activeApp = app;
  }

  // endregion

  get dir() {
    return resolve(this.pageCtx.userConfig.projectStructure?.apps?.dir || "apps");
  }

  get hostAppName() {
    return this.pageCtx.userConfig.projectStructure?.apps?.hostAppName;
  }

  get hostApp() {
    return this.pageCtx.userConfig.projectStructure?.apps?.hostAppName || this.app;
  }

  get regex() {
    return new RegExp(`^/?(${Array.from(this.apps).join("|")})`);
  }

  hasApp(app: string) {
    return this.apps.has(app);
  }

  async resolveFrameworkAndAdapterConfiguration() {
    [this._adapter, this._framework] = await Promise.all([
      __DEV__
        ? internalRunnableDevEnvironment.runner.import<Adapter>(`@fluxora/adapter-${this.adapterName}`)
        : (import(/* @vite-ignore */ `@fluxora/adapter-${this.adapterName}`) as Promise<Adapter>),
      __DEV__
        ? internalRunnableDevEnvironment.runner.import<TFramework>(`@fluxora/framework-${this.frameworkName}/vite`)
        : (import(/* @vite-ignore */ `@fluxora/framework-${this.frameworkName}/vite`) as Promise<TFramework>)
    ]);
  }

  getAppExposedModules(app: string) {
    return this._exposedModules.get(app);
  }

  addAppExposedModule(app: string, module: string, path: string) {
    const modules = this._exposedModules.get(app) || new Map();
    modules.set(module, path);
    this._exposedModules.set(app, modules);
  }

  addPathsToApp(appName: string, importPath: string) {
    const importedModulePath = this.getAppExposedModules(appName)?.get(`./${importPath}`);

    if (!importedModulePath) {
      throw new Error(`Something went wrong while resolving the path of the imported module "${importPath}"`);
    }

    const exposedModuleFs = projectFs
      .cache(this.pageCtx.cache.root)
      .apps(this.dir.replace(process.cwd(), "."))
      .app(appName)
      .exposedModule(importPath);

    exposedModuleFs.write(`export * from "${exposedModuleFs.relative(importedModulePath)}";`);
  }

  isAppLoaded(appName: string) {
    return this.loadedApps.has(appName);
  }

  setAppLoaded(appName: string) {
    this.loadedApps.add(appName);
  }

  async loadApp(appName: string) {
    if (!this.hasApp(appName)) return;
    await this.pageCtx.vite.server.transformIndexHtml(`/${appName}`, "");
    this.setAppLoaded(appName);
  }

  getAppByPath(pathOrApp?: string) {
    if (this.apps.size === 0 || !pathOrApp) return;
    if (this.apps.has(pathOrApp)) return pathOrApp;
    if (pathOrApp === "/") return this.activeApp;
    if (pathOrApp.startsWith(resolve(this.dir))) {
      const app = pathOrApp
        .slice(resolve(this.dir).length + 1)
        .split("/")
        .at(0);

      if (app) return app;
    }
    const match = pathOrApp.match(this.regex);
    if (!match) return;
    if (!this.hasApp(match[1])) return;
    return match[1];
  }

  getAppPath(app: string) {
    if (!this.getAppByPath(app)) return;
    return resolve(process.cwd(), this.dir, app);
  }

  checks() {
    if (!this.pageCtx.userConfig.projectStructure?.apps?.hostAppName) {
      console.warn(
        `No host app found. Please specify a host app in your fluxora config file or "${this.app}" will be used as the host app.`
      );
    }

    assert(this.adapter, `Something went wrong while resolving "${this.adapterName}" adapter`);
    assert(this.adapter?.boostrap, `Adapter "${this.adapterName}" does not have a boostrap function exported`);
    assert(this.framework, `Something went wrong while resolving "${this.frameworkName}" framework`);
  }
}
