import type { FC } from "react";
import { createRoot } from "react-dom/client";

export const mount = (ComponentElement: FC, container: string) => {
  createRoot(document.querySelector(container)!).render(<ComponentElement />);
};
