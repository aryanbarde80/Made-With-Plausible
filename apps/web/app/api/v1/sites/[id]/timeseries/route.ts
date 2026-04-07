export async function GET() {
  return Response.json({
    data: [
      { date: "2026-04-01", visitors: 320, pageviews: 910 },
      { date: "2026-04-02", visitors: 410, pageviews: 1180 }
    ],
    meta: { page: 1, perPage: 2, total: 2 },
    error: null
  });
}

