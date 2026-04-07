import { getCurrentSession } from "../../lib/auth/session";
import { logger } from "../../lib/logger";

export async function createTRPCContext() {
  const session = await getCurrentSession();
  const requestId = crypto.randomUUID();

  logger.info("trpc.context.created", {
    requestId,
    authenticated: Boolean(session?.user.id),
    orgId: session?.org?.id ?? null
  });

  return {
    requestId,
    userId: session?.user.id ?? null,
    orgId: session?.org?.id ?? null
  };
}
