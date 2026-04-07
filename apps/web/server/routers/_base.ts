import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc/trpc";

export function createCrudRouter(resource: string) {
  return createTRPCRouter({
    list: publicProcedure.query(() => ({
      resource,
      items: []
    })),
    get: publicProcedure.input(z.object({ id: z.string() })).query(({ input }) => ({
      resource,
      id: input.id
    })),
    create: publicProcedure.input(z.record(z.any())).mutation(({ input }) => ({
      resource,
      created: input
    })),
    update: publicProcedure
      .input(z.object({ id: z.string(), data: z.record(z.any()) }))
      .mutation(({ input }) => ({ resource, updated: input })),
    delete: publicProcedure.input(z.object({ id: z.string() })).mutation(({ input }) => ({
      resource,
      deleted: input.id
    }))
  });
}

