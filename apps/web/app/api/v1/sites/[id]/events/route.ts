export async function GET() {
  return Response.json({
    data: [
      { path: "/pricing", source: "Google", country: "India", device: "Mobile" },
      { path: "/docs/plugins", source: "Direct", country: "Germany", device: "Desktop" }
    ],
    meta: { page: 1, perPage: 2, total: 2 },
    error: null
  });
}

