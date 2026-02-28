import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const entity = await prisma.cRMEntity.findUnique({
    where: { id },
    include: {
      person: true,
      organization: true,
      activity: true,
      document: true,
      case: true,
      shipment: true,
      partnerVerification: true,
    },
  });
  if (!entity) {
    return NextResponse.json({ error: 'Entity not found' }, { status: 404 });
  }
  return NextResponse.json(entity);
}
