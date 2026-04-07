import { db } from "@pulseboard/db";
import { generateEmbedding } from "@pulseboard/ai-engine";

export async function runVectorIndexer() {
  const insights = await db.aIInsight.findMany({
    orderBy: { createdAt: "desc" },
    take: 50
  });

  let indexed = 0;

  for (const insight of insights) {
    const content = `${insight.prompt}\n\n${insight.response}`;
    const embedding = await generateEmbedding(content);

    await db.searchDocument.upsert({
      where: {
        sourceType_sourceId: {
          sourceType: "AI_INSIGHT",
          sourceId: insight.id
        }
      },
      update: {
        title: insight.prompt.slice(0, 120),
        content,
        embedding
      },
      create: {
        orgId: insight.orgId,
        siteId: insight.siteId,
        sourceType: "AI_INSIGHT",
        sourceId: insight.id,
        title: insight.prompt.slice(0, 120),
        content,
        embedding
      }
    });

    indexed += 1;
  }

  return { indexed };
}
