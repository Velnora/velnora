import { type FC, type PropsWithChildren, StrictMode } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { FallbackRenderComponent } from "../components/fallback-render-component";

export const EntryApp: FC<PropsWithChildren> = ({ children }) => {
  return (
    <StrictMode>
      <ErrorBoundary
        FallbackComponent={FallbackRenderComponent}
        onError={(error, info) => {
          console.error("ErrorBoundary caught an error:", error, info);
        }}
      >
        {children}
      </ErrorBoundary>
    </StrictMode>
  );
};
