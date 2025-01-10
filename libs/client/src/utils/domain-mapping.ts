declare global {
  interface Window {
    __DNS_APP_JSON__: Record<string, string>;
  }
}

export const domainMapping = new Map(Object.entries((typeof window !== "undefined" && window.__DNS_APP_JSON__) || {}));
