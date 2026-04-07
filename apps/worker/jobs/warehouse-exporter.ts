import { db } from "@pulseboard/db";

export async function runWarehouseExporter() {
  const destinations = await db.warehouseDestination.findMany({
    where: { isEnabled: true },
    take: 20
  });

  let processed = 0;

  for (const destination of destinations) {
    const siteCount = await db.site.count({
      where: { orgId: destination.orgId }
    });
    const insightCount = await db.aIInsight.count({
      where: { orgId: destination.orgId }
    });

    await db.warehouseExportRun.create({
      data: {
        orgId: destination.orgId,
        destinationId: destination.id,
        status: "SUCCEEDED",
        finishedAt: new Date(),
        recordCount: siteCount + insightCount,
        payloadPreview: {
          destinationType: destination.type,
          exported: {
            sites: siteCount,
            insights: insightCount
          }
        }
      }
    });

    processed += 1;
  }

  return { processed };
}
