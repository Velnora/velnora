import { PAGE_RE } from "../const";

export const fileToRoutePath = (file: string) => {
  const clean = file.replace(/\/{2,}/g, "/").replace(PAGE_RE, "$1");
  if (!clean) return "/";
  return clean;
};
