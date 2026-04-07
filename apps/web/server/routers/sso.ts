import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { db } from "@pulseboard/db";

import { upsertSecret } from "../../lib/vault";
import { createTRPCRouter, protectedProcedure } from "../trpc/trpc";

const ssoSchema = z.object({
  name: z.string().min(2).max(80),
  provider: z.enum(["GENERIC_OIDC", "GOOGLE_WORKSPACE", "MICROSOFT_ENTRA"]),
  issuerUrl: z.string().url(),
  clientId: z.string().min(3).max(200),
  clientSecret: z.string().min(3).max(200),
  audience: z.string().max(200).optional(),
  domainHint: z.string().max(200).optional()
});

export const ssoRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.orgId) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return db.sSOConnection.findMany({
      where: { orgId: ctx.orgId },
      orderBy: { createdAt: "desc" }
    });
  }),
  upsert: protectedProcedure.input(ssoSchema).mutation(async ({ ctx, input }) => {
    if (!ctx.orgId) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    await upsertSecret({
      orgId: ctx.orgId,
      name: `sso:${input.provider}:client-secret`,
      scope: "SSO",
      value: input.clientSecret,
      keyHint: input.clientId.slice(0, 6)
    });

    return db.sSOConnection.upsert({
      where: {
        orgId_provider: {
          orgId: ctx.orgId,
          provider: input.provider
        }
      },
      update: {
        name: input.name,
        issuerUrl: input.issuerUrl,
        clientId: input.clientId,
        clientSecret: `vault:sso:${input.provider}:client-secret`,
        audience: input.audience,
        domainHint: input.domainHint,
        isEnabled: true
      },
      create: {
        orgId: ctx.orgId,
        name: input.name,
        provider: input.provider,
        issuerUrl: input.issuerUrl,
        clientId: input.clientId,
        clientSecret: `vault:sso:${input.provider}:client-secret`,
        audience: input.audience,
        domainHint: input.domainHint
      }
    });
  }),
  getLoginUrl: protectedProcedure
    .input(z.object({ provider: z.enum(["GENERIC_OIDC", "GOOGLE_WORKSPACE", "MICROSOFT_ENTRA"]), orgSlug: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const connection = await db.sSOConnection.findFirst({
        where: {
          orgId: ctx.orgId,
          provider: input.provider,
          isEnabled: true
        }
      });

      if (!connection) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const callbackUrl = new URL(
        "/api/auth/sso/callback",
        process.env.RENDER_EXTERNAL_URL ?? "https://pulseboard-web.onrender.com"
      );
      const authorizationUrl = new URL(`${connection.issuerUrl.replace(/\/$/, "")}/authorize`);
      authorizationUrl.searchParams.set("client_id", connection.clientId);
      authorizationUrl.searchParams.set("response_type", "code");
      authorizationUrl.searchParams.set("scope", "openid email profile");
      authorizationUrl.searchParams.set("redirect_uri", callbackUrl.toString());
      authorizationUrl.searchParams.set("state", `${input.orgSlug}:${connection.provider}`);

      if (connection.audience) {
        authorizationUrl.searchParams.set("audience", connection.audience);
      }

      return { url: authorizationUrl.toString() };
    })
});
