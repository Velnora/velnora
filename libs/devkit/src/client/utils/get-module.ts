export const getModule = (module: Record<string, unknown>, names: string[]) => {
  for (const name of names) {
    if (module && typeof module === "object" && name in module) {
      return module[name];
    }
  }

  throw new Error(`None of the specified module names were found: [${names.map(m => `"${m}"`).join(", ")}]`);
};
