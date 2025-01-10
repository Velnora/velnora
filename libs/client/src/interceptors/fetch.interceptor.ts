import { resolveUrl } from "../utils/resolve-url";

export const fetchInterceptor = () => {
  const originalFetch = window.fetch;
  window.fetch = (input, init) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    const resolvedUrl = resolveUrl(url);
    return originalFetch(resolvedUrl, init);
  };
  console.log("[interceptor] Fetch interception enabled.");
};
