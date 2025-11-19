import type { Package, BackendRegistry as VelnoraBackendRegistry } from "@velnora/schemas";
import type { BackendTarget } from "@velnora/schemas";

export class BackendRegistry implements VelnoraBackendRegistry {
  private readonly targets = new Map<string, BackendTarget>();

  register(name: string, target: BackendTarget) {
    if (this.targets.has(name)) {
      throw new Error(`Backend target with name "${name}" is already registered.`);
    }
    this.targets.set(name, target);
  }

  use(app: Package, runtime: string) {
    const target = this.targets.get(runtime);
    if (!target) {
      throw new Error(`No backend target registered for runtime "${runtime}".`);
    }
  }

  list() {
    return Array.from(this.targets.values());
  }

  forApp(appName: string) {
    const target = this.targets.get(appName);
    if (!target) {
      throw new Error(`No backend target found for app "${appName}".`);
    }
    return target;
  }
}
