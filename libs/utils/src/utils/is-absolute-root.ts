/**
 * Checks whether a path string represents the filesystem root.
 *
 * On POSIX systems the root is `"/"`. On Windows it is a drive letter
 * followed by `:\` (e.g. `"C:\\"`).
 *
 * @param path - The path to test.
 * @returns `true` if `path` is the absolute root of the filesystem.
 *
 * @example
 * ```typescript
 * isAbsoluteRoot("/");       // true  (POSIX)
 * isAbsoluteRoot("C:\\");    // true  (Windows)
 * isAbsoluteRoot("/home");   // false
 * ```
 */
export const isAbsoluteRoot = (path: string) =>
  process.platform === "win32" ? /^[a-zA-Z]:\\$/.test(path) : path === "/";
