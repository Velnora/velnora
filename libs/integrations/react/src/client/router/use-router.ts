import { useContext } from "react";

import { routerContext } from "./router-context";

export const useRouter = () => {
  const context = useContext(routerContext);
  return context.router.getPublicInterface();
};
