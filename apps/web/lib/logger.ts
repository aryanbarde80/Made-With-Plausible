type LogLevel = "info" | "warn" | "error";

type LogPayload = Record<string, unknown>;

function write(level: LogLevel, message: string, payload: LogPayload = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    service: "pulseboard-web",
    ...payload
  };

  const serialized = JSON.stringify(entry);

  if (level === "error") {
    console.error(serialized);
    return;
  }

  if (level === "warn") {
    console.warn(serialized);
    return;
  }

  console.log(serialized);
}

export const logger = {
  info(message: string, payload?: LogPayload) {
    write("info", message, payload);
  },
  warn(message: string, payload?: LogPayload) {
    write("warn", message, payload);
  },
  error(message: string, payload?: LogPayload) {
    write("error", message, payload);
  }
};
