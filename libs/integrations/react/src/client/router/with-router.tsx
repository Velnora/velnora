import type { PropsWithChildren } from "react";

import { RouterProvider, type RouterProviderProps } from "./router-provider";

export const withRouter = (children: PropsWithChildren["children"], routerProps: RouterProviderProps) => {
  return <RouterProvider {...routerProps}>{children}</RouterProvider>;
};
