/**
 * Error messages collection of the libraries
 *
 * @internal
 */
export const ErrorMessages = {
  APP_NOT_DEFINED: "Current app is not defined",
  HOST_NOT_VALID_FOR_PRODUCTION:
    "Host which defined by default isn't valid for production. Please define it in fluxora.config.ts or in fluxora.app.config.ts for each app root",

  WORKER_VITE_NOT_INITIALIZED:
    "Vite server is not initialized yet. Please run `createViteServer` before calling this function",
  WORKER_APP_NOT_INITIALIZED: "App is not initialized yet. Please run `serve` before calling this function"
} as const;
