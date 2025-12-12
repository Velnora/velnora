import { type ComponentType, type FC, type PropsWithChildren, useEffect, useMemo, useState } from "react";
import type { PathObject } from "velnora/router";

import type { ReactRouteDescriptor } from "../../types/react-route-descriptor";
import { getLayouts } from "../utils/get-layouts";
import { getPage } from "../utils/get-page";
import type { RouterProps } from "./router";

export const RouterClient: FC<RouterProps & { pathRouteMap: Map<string, ReactRouteDescriptor> }> = ({
  router,
  pathRouteMap
}) => {
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

  let page = Page ? <Page /> : null;

  layouts.forEach((Layout, idx) => {
    page = <Layout key={route?.layouts[idx]}>{page}</Layout>;
  });

  return page;
};
