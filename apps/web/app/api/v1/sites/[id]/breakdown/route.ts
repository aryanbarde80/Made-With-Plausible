export async function GET() {
  return Response.json({
    data: [
      { label: "Organic Search", value: 5210, share: 42 },
      { label: "Direct", value: 3020, share: 24 }
    ],
    meta: { page: 1, perPage: 2, total: 2 },
    error: null
  });
}

