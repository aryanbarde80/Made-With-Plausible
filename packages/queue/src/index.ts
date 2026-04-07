import { Queue } from "bullmq";
import { z } from "zod";

const connection = {
  url: process.env.REDIS_URL ?? "redis://localhost:6379"
};

export const emailJobSchema = z.object({
  to: z.string().email(),
  subject: z.string(),
  template: z.string(),
  data: z.record(z.any())
});

export const alertJobSchema = z.object({
  alertId: z.string()
});

export const reportJobSchema = z.object({
  reportId: z.string()
});

export const emailQueue = new Queue("email-queue", { connection });
export const alertQueue = new Queue("alert-queue", { connection });
export const reportQueue = new Queue("report-queue", { connection });
export const verifyQueue = new Queue("verify-queue", { connection });
export const aiContextQueue = new Queue("ai-context-queue", { connection });

