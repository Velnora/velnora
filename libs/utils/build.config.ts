import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: [{ input: "src/main", name: "velnora.utils" }],
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true
  }
});
