import { MethodNotAllowedInBrowserEnvironmentException } from "../exceptions/method-not-allowed-in-browser-environment.exception";
import { Injectable, PipeTransform } from "../main";

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform() {
    throw new MethodNotAllowedInBrowserEnvironmentException();
  }
}
