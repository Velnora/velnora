import type { FC } from "react";

import { Outlet } from "../../components/outlet";
import { OutletProvider } from "../../context/outlet-context";
import { App } from "/@fluxora/virtual/entry/react/app";
import { App as TemplateApp } from "/@fluxora/virtual/entry/react/template";

const Template: FC = TemplateApp || (({}) => <Outlet />);

export const EntryApp: FC = () => {
  return (
    <OutletProvider Component={App}>
      <Template />
    </OutletProvider>
  );
};
