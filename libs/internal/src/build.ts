import { defu } from "defu";
import { type BuildConfig, defineBuildConfig } from "unbuild";

const getPkgName = (name?: string) => (!name ? "velnora" : name.match(/^velnora\.?/) ? name : `velnora.${name}`);

export const defineNodeConfig = (options: Omit<BuildConfig, "name"> & Record<"name", string>) => {
  console.log(options.name);
  const pkgName = getPkgName(options.name);

  return defineBuildConfig(
    defu<BuildConfig, BuildConfig[]>(options, {
      outDir: "build",
      name: pkgName,
      declaration: true,
      clean: true,
      entries: [{ input: "src/main", name: pkgName }],
      rollup: { emitCJS: false },
      failOnWarn: false
    })
  );
};

export const defineWebConfig = (options: BuildConfig) => {
  const pkgName = getPkgName(options.name);

  return defineBuildConfig(
    defu<BuildConfig, BuildConfig[]>(options, {
      outDir: "build",
      name: pkgName,
      declaration: true,
      clean: true,
      entries: [{ input: "src/main", name: pkgName }],
      rollup: { inlineDependencies: true },
      failOnWarn: false
    })
  );
};
