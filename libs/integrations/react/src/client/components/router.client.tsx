import { type ComponentType, type FC, type PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import type { PathObject } from "velnora/router";

import type { ReactRouteDescriptor } from "../../types/react-route-descriptor";
import { routerContext } from "../router/router-context";
import { getLayouts } from "../utils/get-layouts";
import { getPage } from "../utils/get-page";

export const RouterClient: FC<PropsWithChildren<{ pathRouteMap: Map<string, ReactRouteDescriptor> }>> = ({
  pathRouteMap,
  children
}) => {
  const { router } = useContext(routerContext);
  const [app, setApp] = useState<{ Page: ComponentType | null; layouts: ComponentType<PropsWithChildren>[] }>({
    Page: null,
    layouts: []
  });

  const [path, setPath] = useState<PathObject>(router.pathObject);
  const route = useMemo(() => pathRouteMap.get(path.path), [path]);

  useEffect(() => router.subscribe(path => setPath(path)), []);

  useEffect(() => {
    if (!route) {
      // ToDo: Implement registering a 404 page route
      // console.error(`No matching page found for path: ${router.path}`);
      return;
    }

    void Promise.allSettled([getPage(route), getLayouts(route)]).then(([pageResult, layoutsResult]) => {
      if (pageResult.status === "rejected") {
        console.error(`Error loading page module: ${route.module}`, pageResult.reason);
        return;
      }

      if (layoutsResult.status === "rejected") {
        console.error(`Error loading layouts for route: ${route.module}`, layoutsResult.reason);
        return;
      }

      const Page = pageResult.value || null;
      const layouts = layoutsResult.value;

      setApp({ Page, layouts });
    });
  }, [route]);

  return useMemo(() => {
    const { Page, layouts } = app;

    if (!Page) return <>{children}</>;

    let page = Page ? <Page /> : null;

    layouts.forEach((Layout, idx) => {
      page = <Layout key={route?.layouts[idx]}>{page}</Layout>;
    });

    return page;
  }, [app]);
};
