import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const jurisdictionIds = request.nextUrl.searchParams.get('jurisdictionIds') ?? '';
  const limit = Math.min(Number(request.nextUrl.searchParams.get('limit')) || 50, 200);
  const ids = jurisdictionIds ? jurisdictionIds.split(',').map((s) => s.trim()).filter(Boolean) : [];

  const where = ids.length
    ? { OR: [{ fromNode: { jurisdictionId: { in: ids } } }, { toNode: { jurisdictionId: { in: ids } } }] }
    : {};

  const [nodes, edges] = await Promise.all([
    prisma.legalGraphNode.findMany({
      where: ids.length ? { jurisdictionId: { in: ids } } : {},
      take: limit,
      include: { document: true, jurisdiction: true },
    }),
    prisma.legalGraphEdge.findMany({
      where,
      take: limit,
      include: { fromNode: true, toNode: true },
    }),
  ]);

  return NextResponse.json({
    nodes,
    edges,
    authorityOrder: ['international', 'regional', 'national', 'subnational'],
  });
}
