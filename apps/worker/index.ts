import { runAIContextWarmer } from "./jobs/ai-context-warmer";
import { runAlertChecker } from "./jobs/alert-checker";
import { runReportSender } from "./jobs/report-sender";
import { runSiteVerifier } from "./jobs/site-verifier";
import { logger } from "./lib/logger";

const FIVE_MINUTES = 1000 * 60 * 5;

async function runCycle() {
  logger.info("PulseBoard worker cycle starting");
  logger.info(await runAlertChecker(), "alert-checker complete");
  logger.info(await runSiteVerifier(), "site-verifier complete");
  logger.info(await runAIContextWarmer(), "ai-context-warmer complete");
  logger.info(await runReportSender(), "report-sender complete");
}

async function main() {
  logger.info("PulseBoard worker booting");

  await runCycle();

  const timer = setInterval(() => {
    runCycle().catch((error) => {
      logger.error(error, "worker cycle failed");
    });
  }, Number(process.env.WORKER_POLL_INTERVAL_MS ?? FIVE_MINUTES));

  const shutdown = () => {
    clearInterval(timer);
    logger.info("PulseBoard worker shutting down");
    process.exit(0);
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

main().catch((error) => {
  logger.error(error, "worker failed");
  process.exit(1);
});
