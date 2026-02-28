import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Unified Legal Graph — query nodes and edges (optionally by jurisdiction).
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const jurisdictionIds = searchParams.get("jurisdictionIds")?.split(",").filter(Boolean) ?? [];
  const limit = Math.min(Number(searchParams.get("limit")) || 50, 200);

  const where =
    jurisdictionIds.length > 0
      ? { OR: [{ jurisdictionId: { in: jurisdictionIds } }, { jurisdictionId: null }] }
      : {};

  const [nodes, edges] = await Promise.all([
    prisma.legalGraphNode.findMany({
      where,
      include: {
        document: { select: { id: true, title: true, documentType: true, module: true } },
        jurisdiction: { select: { id: true, code: true, name: true } },
      },
      take: limit,
    }),
    prisma.legalGraphEdge.findMany({
      where: jurisdictionIds.length > 0
        ? {
            OR: [
              { from: { jurisdictionId: { in: jurisdictionIds } } },
              { to: { jurisdictionId: { in: jurisdictionIds } } },
            ],
          }
        : {},
      include: {
        from: { select: { id: true, label: true, nodeType: true } },
        to: { select: { id: true, label: true, nodeType: true } },
      },
      take: limit * 2,
    }),
  ]);

  return NextResponse.json({
    nodes,
    edges,
    authorityOrder: ["international", "regional", "national", "subnational"],
  });
}
