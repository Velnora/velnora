import { type FC, Suspense, useContext } from "react";

import type { ReactRouteDescriptor } from "../../types/react-route-descriptor";
import { routerContext } from "../router/router-context";
import { getLayouts } from "../utils/get-layouts";
import { getPage } from "../utils/get-page";

export const RouterServer: FC<{ pathRouteMap: Map<string, ReactRouteDescriptor> }> = async ({ pathRouteMap }) => {
  const { router } = useContext(routerContext);
  const route = pathRouteMap.get(router.pathObject.path);

  if (!route) {
    // ToDo: Implement registering a 404 page route
    // console.error(`No matching page found for path: ${router.path}`);
    return null;
  }

  const Page = await getPage(route);
  if (!Page) {
    // ctx.logger.error(`No default export found in page module: ${route.module}`);
    // return { status: 404, body: "Not Found" };
    return null;
  }

  const layouts = await getLayouts(route);

  let page = Page ? (
    <Suspense>
      <Page />
    </Suspense>
  ) : null;

  layouts.forEach((Layout, idx) => {
    page = (
      <Suspense>
        <Layout key={route?.layouts[idx]}>{page}</Layout>
      </Suspense>
    );
  });

  return page;
};
