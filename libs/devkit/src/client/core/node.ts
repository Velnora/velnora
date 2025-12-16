import { parse } from "semver";
import type { PackageJson } from "type-fest";
import { v4 as uuidv4 } from "uuid";

import type { PackageKind } from "@velnora/types";
import type { Package, VelnoraAppConfig, VelnoraConfig } from "@velnora/types";

import type { Node as ServerNode } from "../../node/core/node";

export class Node implements Package {
  private readonly _id = uuidv4();
  declare protected _config: VelnoraAppConfig;
  declare private readonly _kind: PackageKind;

  static fromJSON(json: ReturnType<ServerNode["toJSON"]>) {
    const node = new Node(json.root, json.packageJson, json.config);
    Object.assign(node, { _id: json.id, _config: json.appConfig, _kind: json.kind });
    return node;
  }

  constructor(
    readonly root: string,
    readonly packageJson: PackageJson,
    protected readonly rootConfig: Omit<VelnoraConfig, "integrations">
  ) {}

  get id() {
    return this._id;
  }

  get name() {
    return this.packageJson.name || this.basename;
  }

  get basename() {
    return this.root.split("/").pop() || "";
  }

  get version(): Package["version"] {
    const pkgVersion = this.packageJson.version || "1.0.0";
    const semverVersion = parse(pkgVersion);

    return {
      full: pkgVersion,
      major: semverVersion ? semverVersion.major : 1,
      minor: semverVersion ? semverVersion.minor : 0,
      patch: semverVersion ? semverVersion.patch : 0,
      prerelease: semverVersion ? semverVersion.prerelease.join(".") : ""
    };
  }

  get config() {
    return this._config;
  }

  get kind() {
    return this._kind;
  }

  get isHostApplication() {
    return [this.packageJson.name, this.basename].includes(this.rootConfig.apps.hostApp);
  }

  get clientUrl() {
    return this.config.client?.url || (this.isHostApplication ? "/" : `/${this.basename}`);
  }

  get serverUrl() {
    const routePath = this.config.server?.url;
    return typeof routePath === "string" ? routePath : routePath?.(this.version.major) || `/api/${this.basename}/v1`;
  }

  fetchConfig() {
    return Promise.resolve(this._config);
  }
}
