import { defu } from "defu";
import { type BuildConfig, defineBuildConfig } from "unbuild";

export function defineNodeConfig(options: BuildConfig) {
  const name = options.name ? options.name : "velnora";
  const pkgName = name.startsWith("velnora.") ? name : `velnora.${name}`;

  return defineBuildConfig(
    defu(options, {
      outDir: "build",
      name: pkgName,
      declaration: true,
      clean: true,
      entries: [{ input: "src/main", name: pkgName }],
      rollup: { emitCJS: true },
      failOnWarn: false
    })
  );
}

export function defineWebConfig(options: BuildConfig) {
  const name = options.name ? options.name : "velnora";
  const pkgName = name.startsWith("velnora.") ? name : `velnora.${name}`;

  return defineBuildConfig(
    defu(options, {
      outDir: "build",
      name: pkgName,
      declaration: true,
      clean: true,
      entries: [{ input: "src/main", name: pkgName }],
      rollup: { emitCJS: true, inlineDependencies: true },
      failOnWarn: false
    })
  );
}
