import { Request } from "../core/request";
import { Response } from "../core/response";

export interface Middleware {
  (req: Request, res: Response, next: () => void): void;
}
