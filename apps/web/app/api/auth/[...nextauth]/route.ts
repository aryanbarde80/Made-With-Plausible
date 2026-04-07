import { destroySession, getCurrentSession } from "../../../../lib/auth/session";

export async function GET() {
  const session = await getCurrentSession();

  return Response.json({
    authenticated: Boolean(session),
    user: session
      ? {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name
        }
      : null,
    org: session?.org
      ? {
          id: session.org.id,
          slug: session.org.slug,
          name: session.org.name
        }
      : null
  });
}

export async function POST() {
  await destroySession();

  return Response.json({
    ok: true
  });
}
