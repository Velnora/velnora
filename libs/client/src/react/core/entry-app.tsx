import type { FC } from "react";

import { App } from "../../utils/app-entrypoint";
import { App as TemplateApp } from "../../utils/template-entrypoint";

export const EntryApp: FC = () => {
  return (
    <TemplateApp>
      <App />
    </TemplateApp>
  );
};
