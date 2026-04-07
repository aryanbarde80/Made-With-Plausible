import { Resend } from "resend";

export async function sendEmail(input: {
  to: string;
  subject: string;
  html: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const resend = new Resend(apiKey);

  return resend.emails.send({
    from: process.env.RESEND_FROM ?? "PulseBoard <onboarding@resend.dev>",
    to: input.to,
    subject: input.subject,
    html: input.html
  });
}
