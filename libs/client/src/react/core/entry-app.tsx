import { type FC, StrictMode } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { App } from "../../utils/app-entrypoint";
import { App as TemplateApp } from "../../utils/template-entrypoint";
import { FallbackRenderComponent } from "../components/fallback-render-component";

export const EntryApp: FC = () => {
  return (
    <StrictMode>
      <ErrorBoundary
        FallbackComponent={FallbackRenderComponent}
        onError={(error, info) => {
          console.error("ErrorBoundary caught an error:", error, info);
        }}
      >
        <TemplateApp>
          <App />
        </TemplateApp>
      </ErrorBoundary>
    </StrictMode>
  );
};
