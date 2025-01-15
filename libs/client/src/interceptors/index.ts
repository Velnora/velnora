import { fetchInterceptor } from "./fetch.interceptor";
import { xhrInterceptor } from "./xhr.interceptor";

export const intercept = () => {
  fetchInterceptor();
  xhrInterceptor();
};

if (import.meta.hot) {
  import.meta.hot.accept(interceptor => {
    if (!interceptor) return;
    interceptor.intercept();
  });
}
