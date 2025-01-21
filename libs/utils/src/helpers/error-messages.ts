/**
 * Error messages collection of the libraries
 *
 * @internal
 */
export const ErrorMessages = {
  APP_NOT_DEFINED: "Current app is not defined",
  HOST_NOT_VALID_FOR_PRODUCTION:
    "Host which defined by default isn't valid for production. Please define it in fluxora.config.ts or in fluxora.app.config.ts for each app root"
} as const;
