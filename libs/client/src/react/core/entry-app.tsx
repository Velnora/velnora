import type { FC } from "react";

import { App } from "/@fluxora/virtual/entry/react/app";
import { App as TemplateApp } from "/@fluxora/virtual/entry/react/template";

export const EntryApp: FC = () => {
  return (
    <TemplateApp>
      <App />
    </TemplateApp>
  );
};
