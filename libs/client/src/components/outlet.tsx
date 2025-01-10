import { type FC, useContext } from "react";

import { OutletContext } from "../context/outlet-context";

export const Outlet: FC = () => {
  const outletContext = useContext(OutletContext);
  return outletContext?.Component ? <outletContext.Component /> : null;
};
