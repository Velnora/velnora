import { type InlineConfig, createBuilder } from "vite";

export const build = async (inlineConfig: InlineConfig) => {
  const builder = await createBuilder(inlineConfig);
  await builder.buildApp();
};
