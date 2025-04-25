import type { Observable } from "rxjs";

import { MethodNotAllowedInBrowserEnvironmentException } from "../exceptions/method-not-allowed-in-browser-environment.exception";
import type { CallHandler, ExecutionContext, NestInterceptor } from "../main";

export class ClassSerializerInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, _next: CallHandler): Observable<any> | Promise<Observable<any>> {
    throw new MethodNotAllowedInBrowserEnvironmentException();
  }
}
