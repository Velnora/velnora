import type { BuildConfig, BuildEntry } from "unbuild";

export const buildEntries = (pkgName: string, entries?: BuildConfig["entries"]) => {
  const base: BuildEntry = { input: "src/main", name: pkgName };
  return [base, ...(entries || [])] as (string | BuildEntry)[];
};
