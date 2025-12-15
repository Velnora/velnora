import type { JSX, PropsWithChildren } from "react";
import { type ComponentType, type FC, useEffect, useMemo, useState } from "react";
import type { ClientRoute, PathObject, Router } from "velnora/router";

import type { WithDefault } from "@velnora/types";

import type { ReactRouteDescriptor } from "../../types/react-route-descriptor";
import { routerContext } from "./router-context";

export interface RouterProviderProps {
  router: Router;
  routes: ClientRoute[];
}

export const RouterProvider: FC<PropsWithChildren<RouterProviderProps>> = ({ children, router, routes }) => {
  const [location, setLocation] = useState<PathObject>({ path: router.path });
  const [currentDescriptor, setCurrentDescriptor] = useState<ReactRouteDescriptor | null>(null);

  const [layoutComponents, setLayoutComponents] = useState<ComponentType<PropsWithChildren>[]>([]);

  const activeRoute = useMemo(() => routes.find(r => r.path === location.path), [routes, location.path]);

  useEffect(() => {
    if (!activeRoute) {
      setCurrentDescriptor(null);
      return;
    }

    const loadDescriptor = async () => {
      try {
        const mod = (await import(activeRoute.route.module)) as WithDefault<ReactRouteDescriptor>;

        if (!mod?.default) {
          console.error("ReactRouteDescriptor not found in", activeRoute.route.module);
          setCurrentDescriptor(null);
          return;
        }

        setCurrentDescriptor(mod.default);
      } catch (err) {
        console.error("Failed to load route descriptor:", err);
        setCurrentDescriptor(null);
      }
    };

    void loadDescriptor();
  }, [activeRoute]);

  useEffect(() => {
    if (!currentDescriptor) {
      setLayoutComponents([]);
      return;
    }

    const loadComponents = async () => {
      // try {
      //   // 1. Load page
      //   const pageMod = (await import(/* @vite-ignore */ currentDescriptor.module)) as WithDefault<ComponentType>;
      //   const Page = pageMod.default;
      //   if (!Page) {
      //     console.error("Page component not found in", currentDescriptor.module);
      //     setPageComponent(null);
      //     setLayoutComponents([]);
      //     return;
      //   }
      //   // 2. Load all layouts (root → nearest)
      //   const layoutMods = await Promise.all(
      //     currentDescriptor.layouts.map(id => import(/* @vite-ignore */ id) as Promise<WithDefault<ComponentType>>)
      //   );
      //   const layouts = layoutMods.map(m => m.default).filter((L): L is ComponentType => Boolean(L));
      //   setPageComponent(() => Page);
      //   setLayoutComponents(layouts);
      // } catch (err) {
      //   console.error("Failed to load page/layout components:", err);
      //   setPageComponent(null);
      //   setLayoutComponents([]);
      // }
    };

    void loadComponents();
  }, [currentDescriptor]);

  useEffect(() => {
    return router.subscribe(setLocation);
  }, [router]);

  const tree = useMemo(() => {
    const tree: JSX.Element | null = <>{children}</>;

    for (let i = layoutComponents.length - 1; i >= 0; i--) {
      // const Layout = layoutComponents[i]!;
      // const layoutId = currentDescriptor!.layouts[i]!;
      // tree = <Layout key={layoutId}>{tree}</Layout>;
    }

    return tree;
  }, [layoutComponents, location.path, currentDescriptor]);

  return <routerContext.Provider value={{ router }}>{tree}</routerContext.Provider>;
};
