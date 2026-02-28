import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const relationships = await prisma.relationship.findMany({
    where: { OR: [{ fromId: id }, { toId: id }] },
    include: { from: true, to: true },
  });
  return NextResponse.json(relationships);
}
