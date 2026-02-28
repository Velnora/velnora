/**
 * @velnora-meta
 * type: author
 * author: MDReal
 */

import { intersects, satisfies, valid, validRange } from "semver";

export const validateVersionRange = (version: string, range: string) => {
  const cleanedVersion = version.trim().replace(/v(\d+\.)/gi, "$1");
  const cleanedRange = range
    .trim()
    .replace(/v(\d+\.)/gi, "$1")
    .replace(/(^|\s+|\|\|)([^><]?)=(\d+\.)/g, "$1$2$3");

  const validVersion = valid(cleanedVersion);
  const validatedRange = validRange(cleanedRange);

  if (validVersion) {
    return satisfies(validVersion, validVersion, { includePrerelease: true });
  }

  if (validatedRange) {
    return intersects(cleanedVersion, validatedRange, { includePrerelease: true });
  }

  return false;
};
