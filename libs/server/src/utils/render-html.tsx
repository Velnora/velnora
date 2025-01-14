import { renderToString } from "react-dom/server";

import { EntryApp } from "/@fluxora/client-server/react";

export const renderHtml = () => {
  const jsx = <EntryApp />;
  return renderToString(jsx);
};
