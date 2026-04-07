import { APP_URL } from "./constants";

export function getAppUrl() {
  return (
    process.env.RENDER_EXTERNAL_URL ??
    APP_URL
  );
}

export function getDocsUrl() {
  return process.env.DOCS_URL ?? "http://localhost:3002";
}

export function getBaseUrl() {
  return typeof window === "undefined" ? getAppUrl() : window.location.origin;
}

export function isRenderRuntime() {
  return process.env.RENDER === "true";
}
