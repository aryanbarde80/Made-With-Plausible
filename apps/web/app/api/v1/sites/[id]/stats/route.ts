export async function GET() {
  const fallback = { visitors: 12340, pageviews: 44820, bounce_rate: 41.2, visit_duration: 216 };

  return Response.json({
    data: fallback,
    meta: { page: 1, perPage: 1, total: 1 },
    error: null
  });
}
