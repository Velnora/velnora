import { RegisteredApp } from "./registered-app";
import { RegisteredLib } from "./registered-lib";
import { RegisteredTemplate } from "./registered-template";

export type RegisteredModule = RegisteredApp | RegisteredLib | RegisteredTemplate;
