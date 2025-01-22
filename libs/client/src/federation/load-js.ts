export const loadJS = async (url: string | (() => PromiseLike<string> | string), fn: GlobalEventHandlers["onload"]) => {
  const resolvedUrl = typeof url === "function" ? await url() : url;
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.onload = fn;
  script.src = resolvedUrl;
  document.getElementsByTagName("head")[0].appendChild(script);
};
