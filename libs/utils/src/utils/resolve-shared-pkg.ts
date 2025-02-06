export const resolveSharedPkg = (id: string) => {
  if (!id.includes("node_modules")) return null;
  const sector = id.split("node_modules/")[1];
  return sector.startsWith("@") ? sector.split("/").slice(0, 2).join("/") : sector.split("/")[0];
};
