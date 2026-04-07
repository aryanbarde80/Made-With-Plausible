import nodemailer from "nodemailer";

export function createMailer() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 1025),
    secure: false,
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        : undefined
  });
}

export async function sendEmail(input: {
  to: string;
  subject: string;
  html: string;
}) {
  const transporter = createMailer();

  return transporter.sendMail({
    from: process.env.SMTP_FROM ?? "hello@pulseboard.local",
    ...input
  });
}

