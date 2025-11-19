import { type ComponentType, type FC, Fragment, type PropsWithChildren, StrictMode } from "react";
import { createRoot } from "react-dom/client";

import type { BaseMountOptions } from "@velnora/plugin-api";

// import type { MountFn } from "@velnora/runtime-client";

import type { ReactIntegrationOptions } from "../types/react-integration-options";

export const createReactMount = <TProps extends BaseMountOptions>(
  App: ComponentType<TProps>,
  opts: ReactIntegrationOptions = {}
) => {
  // return ({ container, props, context }) => {
  //   const resolvedProps = props || ({} as TProps);
  //   const RootWrapper: FC<PropsWithChildren> = opts.errorBoundary
  //     ? ({ children }) => (opts.errorBoundary ? <opts.errorBoundary>{children}</opts.errorBoundary> : null)
  //     : ({ children }) => <>{children}</>;
  //   const StrictOrFragment: FC<PropsWithChildren> = opts.strictMode ? StrictMode : Fragment;
  //
  //  // future-proof: if React 19 changes root API, we patch here, not in apps.
  //   const root = createRoot(container);
  //   root.render(
  //     <StrictOrFragment>
  //       <RootWrapper>
  //         <App {...resolvedProps} context={context} />
  //       </RootWrapper>
  //     </StrictOrFragment>
  //   );
  //   return () => root.unmount();
  // };
};
