import type { FC, PropsWithChildren } from "react";

export const App: FC<PropsWithChildren> = ({ children }) => {
  return (
    <html>
      <head>
        <title>velnora</title>
      </head>

      <body>{children}</body>
    </html>
  );
};
