import type { JsonObject } from "../types";

export interface Transformers {
  json?<TResult>(requestObject: JsonObject): TResult;
  data?(logs: any[]): any[];
}
