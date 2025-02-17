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
  VITE_FEDERATION_APP_NOT_FOUND: (appName: string) => `App "${appName}" not found`,
  WORKER_APP_NOT_INITIALIZED: "App is not initialized yet. Please run `serve` before calling this function",
  WORKER_UNKNOWN_ERROR_ON_RENDER: "An error occurred while rendering the page",
  WORKER_APP_THROW_ERROR: "An error occurred in the app",

  SERVER_ENV_NOT_RUNNABLE: "Server environment is not runnable",

  TEMPLATE_BUILD_OUTPUT_NOT_FOUND: "Template build output not found",

  VITE_FEDERATION_MODULE_NOT_FOUND: (exposedModule: string, appName: string) =>
    `Module "${exposedModule}" not exposed from app "${appName}"`
} as const;
