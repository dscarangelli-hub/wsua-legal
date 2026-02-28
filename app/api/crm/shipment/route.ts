import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureCRMEntityForShipment } from '@/lib/crm-entities';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { trackingNumber, status, origin, destination } = body;
    const shipment = await prisma.shipment.create({
      data: {
        trackingNumber: trackingNumber ?? null,
        status: status ?? null,
        origin: origin ?? null,
        destination: destination ?? null,
      },
    });
    await ensureCRMEntityForShipment(shipment.id);
    return NextResponse.json(shipment);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to create shipment' }, { status: 500 });
  }
}
