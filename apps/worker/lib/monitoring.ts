import * as Sentry from "@sentry/node";

export function initWorkerMonitoring() {
  if (!process.env.SENTRY_DSN) {
    return;
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV ?? "development",
    release: process.env.RENDER_GIT_COMMIT ?? "local",
    tracesSampleRate: 0.1
  });
}

export { Sentry };
