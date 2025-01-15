import type { FC, PropsWithChildren } from "react";

export const App: FC<PropsWithChildren> = ({ children }) => {
  return (
    <html>
      <head>
        <title>Some Dummy shit</title>
      </head>

      <body>{children}</body>
    </html>
  );
};
