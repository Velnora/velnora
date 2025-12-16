import { layout } from "velnora/react";

export default layout(({ children }) => {
  return (
    <html>
      <head>
        <title>Landing Page</title>
      </head>
      <body>{children}</body>
    </html>
  );
});
