import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc/trpc";

export const authRouter = createTRPCRouter({
  login: publicProcedure.input(z.object({ email: z.string().email(), password: z.string() })).mutation(({ input }) => ({
    ok: true,
    user: { email: input.email }
  })),
  register: publicProcedure.input(z.object({ email: z.string().email(), password: z.string(), name: z.string() })).mutation(({ input }) => ({
    ok: true,
    user: input
  })),
  logout: publicProcedure.mutation(() => ({ ok: true })),
  sendMagicLink: publicProcedure.input(z.object({ email: z.string().email() })).mutation(({ input }) => ({ ok: true, email: input.email })),
  verify2FA: publicProcedure.input(z.object({ code: z.string() })).mutation(() => ({ ok: true }))
});

