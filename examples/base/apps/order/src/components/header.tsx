"use expose";

import type { FC } from "react";

import { UnknownHeader } from "./unknown-header";

export const Header: FC = () => {
  return (
    <header>
      <UnknownHeader />
      Header2
    </header>
  );
};
