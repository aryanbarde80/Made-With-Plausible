export async function GET(_: Request, { params }: { params: { token: string } }) {
  return Response.json({ data: { token: params.token, url: `/share/${params.token}` }, meta: null, error: null });
}

