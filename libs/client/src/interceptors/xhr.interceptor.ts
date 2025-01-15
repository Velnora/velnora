import { resolveUrl } from "../utils/resolve-url";

export const xhrInterceptor = () => {
  const originalXHR = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (
    method,
    url,
    isAsync: boolean = true,
    user?: string | null,
    password?: string | null
  ) {
    const resolvedUrl = resolveUrl(url.toString());
    originalXHR.call(this, method, resolvedUrl, isAsync, user, password);
  };
  if (import.meta.env.DEV) {
    console.debug("[interceptor] XHR interception enabled.");
  }
};

if (import.meta.hot) {
  import.meta.hot.accept(module => {
    if (!module) return;
    module.xhrInterceptor();
  });
}
