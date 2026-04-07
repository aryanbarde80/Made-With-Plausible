export async function GET(_: Request, { params }: { params: { slug: string } }) {
  return Response.json({ data: { slug: params.slug }, meta: null, error: null });
}

