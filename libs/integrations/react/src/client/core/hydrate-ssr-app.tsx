import { Router, type RouterProps } from "../components/router";
import { mount } from "./mount";

export const hydrateSsrApp = (options: RouterProps) => {
  mount(<Router {...options} />, { mode: "ssr" });
};
