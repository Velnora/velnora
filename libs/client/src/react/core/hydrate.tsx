import { hydrateRoot } from "react-dom/client";

import { App } from "../../utils/app-entrypoint";
import { App as TemplateApp } from "../../utils/template-entrypoint";
import { EntryApp } from "./entry-app";

export const hydrate = () => {
  hydrateRoot(
    document,
    <EntryApp>
      <TemplateApp>
        <App />
      </TemplateApp>
    </EntryApp>
  );
};
