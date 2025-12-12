import { specialNames } from "./special-names";

export const specialName = (name: string) => specialNames[name] || name;
