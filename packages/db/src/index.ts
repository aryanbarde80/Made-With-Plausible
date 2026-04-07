import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __pulseboardPrisma__: PrismaClient | undefined;
}

export const db =
  global.__pulseboardPrisma__ ??
  new PrismaClient({
    log: ["warn", "error"]
  });

if (process.env.NODE_ENV !== "production") {
  global.__pulseboardPrisma__ = db;
}

export * from "@prisma/client";

