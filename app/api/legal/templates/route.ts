import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Template library — filter by jurisdiction and scenario tags.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const jurisdictionId = searchParams.get("jurisdictionId") ?? undefined;
  const scenarioTag = searchParams.get("scenarioTag") ?? undefined;
  const source = searchParams.get("source") ?? undefined;
  const limit = Math.min(Number(searchParams.get("limit")) || 30, 100);

  const where: Record<string, unknown> = { isActive: true };
  if (jurisdictionId) where.jurisdictionId = jurisdictionId;
  if (scenarioTag) where.scenarioTags = { has: scenarioTag };
  if (source) where.source = source;

  const templates = await prisma.legalTemplate.findMany({
    where,
    include: {
      jurisdiction: { select: { id: true, code: true, name: true } },
      _count: { select: { sections: true, links: true } },
    },
    orderBy: [{ updatedAt: "desc" }],
    take: limit,
  });

  return NextResponse.json({ templates });
}
