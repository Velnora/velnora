import { layout } from "velnora/react";

export default layout(({ children }) => {
  return (
    <html>
      <head></head>
      <body>{children}</body>
    </html>
  );
});
