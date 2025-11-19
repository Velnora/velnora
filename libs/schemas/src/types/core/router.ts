import type { NextFunction, Request, Response } from "express";

export interface Router {
  handleRequest(this: Router, request: Request, res: Response, next: NextFunction): Promise<void>;
}
