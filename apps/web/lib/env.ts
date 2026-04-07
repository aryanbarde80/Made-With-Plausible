const localhostAppUrl = "http://localhost:3000";

export function getAppUrl() {
  return (
    process.env.APP_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXTAUTH_URL ??
    process.env.RENDER_EXTERNAL_URL ??
    localhostAppUrl
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

