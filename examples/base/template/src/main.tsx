import type { FC, PropsWithChildren } from "react";

export const App: FC<PropsWithChildren> = ({ children }) => {
  return (
    <html>
      <head>
        <title>Fluxora</title>
      </head>

      <body>{children}</body>
    </html>
  );
};
