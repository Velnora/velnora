import type { MicroApp } from "../../types";
import type { AllAppsConfiguration } from "../../types/all-apps-configurations";

interface FederationOptions {
  remoteEntryPath?: string;
}

export interface DynamicFederationPluginOptions {
  app: MicroApp;
  apps: MicroApp[];
  allAppsConfigurations: AllAppsConfiguration;
  templateRoot: string;
  options?: FederationOptions;
}
