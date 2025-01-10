import { type FC, type PropsWithChildren, createContext } from "react";

export interface OutletContextProps {
  Component: FC;
}

export const OutletContext = createContext<OutletContextProps>(null!);

export const OutletProvider: FC<PropsWithChildren<OutletContextProps>> = ({ Component, children }) => {
  return <OutletContext.Provider value={{ Component }}>{children}</OutletContext.Provider>;
};
