import { getCurrentSession } from "../../lib/auth/session";

export async function createTRPCContext() {
  const session = await getCurrentSession();

  return {
    userId: session?.user.id ?? null,
    orgId: session?.org?.id ?? null
  };
}
