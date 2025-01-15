import { resolveUrl } from "../utils/resolve-url";

export const fetchInterceptor = () => {
  const originalFetch = window.fetch;
  window.fetch = (input, init) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    const resolvedUrl = resolveUrl(url);
    return originalFetch(resolvedUrl, init);
  };
  if (import.meta.env.DEV) {
    console.debug("[interceptor] Fetch interception enabled.");
  }
};

if (import.meta.hot) {
  import.meta.hot.accept(module => {
    if (!module) return;
    module.fetchInterceptor();
  });
}
