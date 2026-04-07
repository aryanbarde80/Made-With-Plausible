import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc/trpc";

export const userRouter = createTRPCRouter({
  getMe: publicProcedure.query(() => ({ id: "demo-user", email: "admin@pulseboard.dev" })),
  updateProfile: publicProcedure.input(z.record(z.any())).mutation(({ input }) => input),
  changePassword: publicProcedure.input(z.object({ currentPassword: z.string(), newPassword: z.string() })).mutation(() => ({ ok: true })),
  setup2FA: publicProcedure.mutation(() => ({ secret: "DEMO-SECRET" }))
});

