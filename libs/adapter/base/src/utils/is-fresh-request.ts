import type { IncomingHttpHeaders } from "http";

import { parseHttpDate } from "./parse-http-date";
import { parseTokenList } from "./parse-token-list";

const CACHE_CONTROL_NO_CACHE_REGEXP = /(?:^|,)\s*?no-cache\s*?(?:,|$)/;

export const isFreshRequest = (
  reqHeaders: IncomingHttpHeaders,
  resHeaders: Record<string, string | number | undefined>
) => {
  // fields
  const modifiedSince = reqHeaders["if-modified-since"];
  const noneMatch = reqHeaders["if-none-match"];

  // unconditional request
  if (!modifiedSince && !noneMatch) {
    return false;
  }

  // Always return stale when Cache-Control: no-cache
  // to support end-to-end reload requests
  // https://tools.ietf.org/html/rfc2616#section-14.9.4
  const cacheControl = reqHeaders["cache-control"];
  if (cacheControl && CACHE_CONTROL_NO_CACHE_REGEXP.test(cacheControl)) {
    return false;
  }

  // if-none-match takes precedent over if-modified-since
  if (noneMatch) {
    if (noneMatch === "*") {
      return true;
    }
    const etag = resHeaders.etag;

    if (!etag) {
      return false;
    }

    const matches = parseTokenList(noneMatch);
    for (let i = 0; i < matches.length; i++) {
      let match = matches[i];
      if (match === etag || match === "W/" + etag || "W/" + match === etag) {
        return true;
      }
    }

    return false;
  }

  // if-modified-since
  if (modifiedSince) {
    const lastModified = resHeaders["last-modified"];
    const modifiedStale = !lastModified || !(parseHttpDate(lastModified.toString()) <= parseHttpDate(modifiedSince));

    if (modifiedStale) {
      return false;
    }
  }

  return true;
};
