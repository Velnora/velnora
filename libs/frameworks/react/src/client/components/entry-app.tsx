import TemplateApp from "/__virtual__/template";
import { type FC, type PropsWithChildren } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { FallbackRenderComponent } from "./fallback-render-component";

export const EntryApp: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ErrorBoundary FallbackComponent={FallbackRenderComponent}>
      <TemplateApp>
        <ErrorBoundary FallbackComponent={FallbackRenderComponent}>{children}</ErrorBoundary>
      </TemplateApp>
    </ErrorBoundary>
  );
};
