import { getAppUrl } from "../../../lib/env";

export async function GET() {
  return Response.json({
    ok: true,
    service: "pulseboard-web",
    url: getAppUrl(),
    timestamp: new Date().toISOString()
  });
}

