import { fetchInterceptor } from "./fetch.interceptor";
import { xhrInterceptor } from "./xhr.interceptor";

export const intercept = () => {
  fetchInterceptor();
  xhrInterceptor();
};
