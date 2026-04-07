export async function GET() {
  return Response.json({
    message: "Auth endpoint is active. Configure NextAuth providers to enable credentials and magic-link sign-in."
  });
}

export async function POST() {
  return Response.json({
    message: "Auth endpoint is active. Configure NextAuth providers to enable credentials and magic-link sign-in."
  });
}
