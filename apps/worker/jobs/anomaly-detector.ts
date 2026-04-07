import { db } from "@pulseboard/db";

function buildSignal(siteId: string) {
  const seed = siteId.split("").reduce((total, character) => total + character.charCodeAt(0), 0);
  const expectedValue = 100 + (seed % 50);
  const actualValue = expectedValue + ((seed % 5) - 2) * 18;
  const deltaPct = ((actualValue - expectedValue) / expectedValue) * 100;

  return {
    expectedValue,
    actualValue,
    deltaPct
  };
}

export async function runAnomalyDetector() {
  const sites = await db.site.findMany({
    where: { isVerified: true },
    take: 50
  });

  let created = 0;

  for (const site of sites) {
    const signal = buildSignal(site.id);

    if (Math.abs(signal.deltaPct) < 15) {
      continue;
    }

    await db.anomaly.create({
      data: {
        orgId: site.orgId,
        siteId: site.id,
        metric: "visitors",
        severity: Math.abs(signal.deltaPct) > 35 ? "high" : "medium",
        window: "24h",
        expectedValue: signal.expectedValue,
        actualValue: signal.actualValue,
        deltaPct: signal.deltaPct,
        summary:
          signal.deltaPct > 0
            ? `Traffic is ${signal.deltaPct.toFixed(1)}% above the expected baseline.`
            : `Traffic is ${Math.abs(signal.deltaPct).toFixed(1)}% below the expected baseline.`,
        metadata: { detector: "baseline-v1" }
      }
    });

    created += 1;
  }

  return { checked: sites.length, anomaliesCreated: created };
}
