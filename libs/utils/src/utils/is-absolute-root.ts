export const isAbsoluteRoot = (path: string) =>
  process.platform === "win32" ? /^[a-zA-Z]:\\$/.test(path) : path === "/";
