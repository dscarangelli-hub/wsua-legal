import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureCRMEntityForShipment } from "@/lib/crm-entities";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { trackingNumber, status, origin, destination } = body;

    const shipment = await prisma.shipment.create({
      data: {
        trackingNumber,
        status,
        origin,
        destination
      }
    });

    const crmEntity = await ensureCRMEntityForShipment(shipment);

    return NextResponse.json(
      { shipment, crmEntity },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create shipment" },
      { status: 500 }
    );
  }
}

