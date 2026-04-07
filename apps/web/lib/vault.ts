import { db } from "@pulseboard/db";

import { decryptText, encryptText } from "./security";

export async function upsertSecret(input: {
  orgId: string;
  name: string;
  scope: "ORGANIZATION" | "INTEGRATION" | "SSO";
  value: string;
  keyHint?: string;
}) {
  return db.secret.upsert({
    where: {
      orgId_name: {
        orgId: input.orgId,
        name: input.name
      }
    },
    update: {
      cipherText: encryptText(input.value),
      keyHint: input.keyHint
    },
    create: {
      orgId: input.orgId,
      name: input.name,
      scope: input.scope,
      cipherText: encryptText(input.value),
      keyHint: input.keyHint
    }
  });
}

export async function readSecret(orgId: string, name: string) {
  const record = await db.secret.findFirst({
    where: {
      orgId,
      name
    }
  });

  if (!record) {
    return null;
  }

  return decryptText(record.cipherText);
}
