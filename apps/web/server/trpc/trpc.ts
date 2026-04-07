import { initTRPC } from "@trpc/server";
import superjson from "superjson";

import { createTRPCContext } from "./context";

const t = initTRPC.context<Awaited<ReturnType<typeof createTRPCContext>>>().create({
  transformer: superjson
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

