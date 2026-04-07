import { Resend } from "resend";
import { z } from "zod";

const emailPayloadSchema = z.object({
  to: z.string().email().max(320),
  subject: z.string().min(1).max(200),
  html: z.string().min(1).max(100_000)
});

export async function sendEmail(input: {
  to: string;
  subject: string;
  html: string;
}) {
  const payload = emailPayloadSchema.parse(input);
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const resend = new Resend(apiKey);

  return resend.emails.send({
    from: process.env.RESEND_FROM ?? "PulseBoard <onboarding@resend.dev>",
    to: payload.to,
    subject: payload.subject,
    html: payload.html
  });
}
