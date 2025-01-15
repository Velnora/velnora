import { domainMapping } from "./domain-mapping";

export const resolveUrl = (url: string) => {
  for (const domain of domainMapping.keys()) {
    if (url.startsWith(domain)) {
      return url.replace(new RegExp(`^${domain}`), domainMapping.get(domain)!);
    }
  }
  if (!url.startsWith("http")) {
    return `${window.location.origin}${url}`;
  }
  return url;
};
