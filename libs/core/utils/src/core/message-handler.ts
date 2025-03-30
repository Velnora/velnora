export const messageHandler = (...messages: unknown[]) =>
  messages.map(message => {
    switch (typeof message) {
      case "string":
      case "number":
      case "boolean":
      case "symbol":
      case "bigint":
        return message.toString();

      case "object":
      case "function":
        return JSON.stringify(message, null, 2);

      case "undefined":
        return "";
    }
  });
