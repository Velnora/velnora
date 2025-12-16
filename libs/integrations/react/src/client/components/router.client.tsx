import { type ComponentType, type FC, type PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import type { PathObject } from "velnora/router";

import type { ReactRouteDescriptor } from "../../types/react-route-descriptor";
import { routerContext } from "../router/router-context";
import { getLayouts } from "../utils/get-layouts";
import { getPage } from "../utils/get-page";

export const RouterClient: FC<{ pathRouteMap: Map<string, ReactRouteDescriptor> }> = ({ pathRouteMap }) => {
  const { router } = useContext(routerContext);
  const [Page, setPage] = useState<ComponentType | null>(null);
  const [path, setPath] = useState<PathObject>(router.pathObject);
  const [layouts, setLayouts] = useState<ComponentType<PropsWithChildren>[]>([]);
  const route = useMemo(() => pathRouteMap.get(path.path), [path]);

  useEffect(() => router.subscribe(path => setPath(path)), []);

  useEffect(() => {
    if (!route) {
      // ToDo: Implement registering a 404 page route
      // console.error(`No matching page found for path: ${router.path}`);
      return;
    }

    void getPage(route).then(Page => setPage(() => Page || null));
  }, [route]);

  useEffect(() => {
    if (!route) {
      // ToDo: Implement registering a 404 page route
      // console.error(`No matching page found for path: ${router.path}`);
      return;
    }

    void getLayouts(route).then(layouts => setLayouts(layouts));
  }, [route]);

  return useMemo(() => {
    let page = Page ? <Page /> : null;

    layouts.forEach((Layout, idx) => {
      page = <Layout key={route?.layouts[idx]}>{page}</Layout>;
    });

    return page;
  }, [Page, route]);
};
