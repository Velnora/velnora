export class MethodNotAllowedInBrowserEnvironmentException extends Error {
  constructor() {
    super(
      "Method not allowed for browser environment. Please make sure you're not using called method in browser env. If found any bugs please report it to the library owner."
    );
  }
}
