import { hydrateRoot } from "react-dom/client";

import { EntryApp } from "./entry-app";

export const hydrate = () => {
  hydrateRoot(document, <EntryApp />);
};
