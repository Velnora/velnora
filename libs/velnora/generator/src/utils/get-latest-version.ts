import { npmRegistryFallbackVersions } from "./npm-registry-fallback-versions";

export const getLatestVersion = async (pkg: string) => {
  try {
    const response = await fetch(`https://registry.npmjs.org/${pkg}/latest`);
    const npmRegistry = await response.json();
    return `^${npmRegistry.version}`;
  } catch {
    if (pkg in npmRegistryFallbackVersions) {
      return npmRegistryFallbackVersions[pkg as keyof typeof npmRegistryFallbackVersions];
    }

    throw new Error(`Can't fetch version for package "${pkg}". Please check connection to internet.`);
  }
};
