import { defu } from "defu";
import { type BuildConfig, defineBuildConfig } from "unbuild";

export function defineNodeConfig(options: BuildConfig) {
  return defineBuildConfig(
    defu(options, {
      declaration: true,
      clean: true,
      rollup: {
        emitCJS: true
      }
    })
  );
}
