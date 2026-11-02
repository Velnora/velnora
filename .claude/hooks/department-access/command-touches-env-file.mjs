const ENV_FILE_IN_COMMAND = /(^|[\s'"`=\\/<>|;&(:,])\.env(?![\w-]|\.example(?![\w.-]))/;

/**
 * True when a shell command names `.env` or a variant such as `.env.local`.
 * `.env.example` and property access like `process.env` don't count.
 */
export const commandTouchesEnvFile = command => {
  return ENV_FILE_IN_COMMAND.test(command);
};
