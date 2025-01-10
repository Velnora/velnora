import { type FC } from "react";

import { Outlet } from "@fluxora/client";

export const App: FC = () => {
  return (
    <html>
      <head>
        <title>Some Dummy shit</title>
      </head>

      <body>
        <Outlet />
      </body>
    </html>
  );
};
