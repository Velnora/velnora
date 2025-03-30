import { type FC, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

import { EntryApp } from "../components/entry-app";

export const hydrate = (Component: FC) => {
  hydrateRoot(
    document,
    <StrictMode>
      <EntryApp>
        <Component />
      </EntryApp>
    </StrictMode>
  );
};
