import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const claim = await prisma.claim.findUnique({
    where: { id },
    include: { category: true, evidence: true },
  });
  if (!claim) {
    return NextResponse.json({ error: 'Claim not found' }, { status: 404 });
  }
  return NextResponse.json(claim);
}
