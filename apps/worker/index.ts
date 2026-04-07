import { runAIContextWarmer } from "./jobs/ai-context-warmer";
import { runAlertChecker } from "./jobs/alert-checker";
import { runReportSender } from "./jobs/report-sender";
import { runSiteVerifier } from "./jobs/site-verifier";
import { logger } from "./lib/logger";

async function main() {
  logger.info("PulseBoard worker booting");
  logger.info(await runAlertChecker(), "alert-checker complete");
  logger.info(await runSiteVerifier(), "site-verifier complete");
  logger.info(await runAIContextWarmer(), "ai-context-warmer complete");
  logger.info(await runReportSender(), "report-sender complete");
}

main().catch((error) => {
  logger.error(error, "worker failed");
  process.exit(1);
});

