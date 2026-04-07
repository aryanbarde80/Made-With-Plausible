export async function GET() {
  return Response.json({
    data: [
      { id: "demo-site", domain: "demo.pulseboard.dev" },
      { id: "shop-site", domain: "shop.pulseboard.dev" }
    ],
    meta: { page: 1, perPage: 20, total: 2 },
    error: null
  });
}

export async function POST() {
  return Response.json({
    data: { id: "new-site" },
    meta: { page: 1, perPage: 1, total: 1 },
    error: null
  });
}

