import type { ConsolaReporter } from "consola";

import type { CreateLoggerOptions, CreateRemoteReporterOptions } from "../types";

export const remoteReporter = (
  options: CreateRemoteReporterOptions,
  loggerOptions: CreateLoggerOptions
): ConsolaReporter => {
  const transformJson = loggerOptions?.transformers?.json || (requestObject => requestObject);
  const transformData = loggerOptions?.transformers?.data || (logs => logs);

  return {
    log(logObject) {
      if (!options.servers.length) return;
      const transformed = transformData(logObject.args);
      const payload = Array.isArray(transformed) ? transformed : [transformed];

      Promise.allSettled(
        options.servers.map(({ url, headers }) =>
          fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...headers },
            body: JSON.stringify(
              transformJson({
                name: loggerOptions.name,
                level: logObject.type,
                data: payload,
                timestamp: logObject.date.toISOString()
              })
            )
          })
        )
      )
        .then(null)
        .catch();
    }
  };
};
