import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const entity = await prisma.cRMEntity.findUnique({
    where: { id },
    include: {
      person: true,
      organization: true,
      activity: true,
      document: true,
      case: true,
      shipment: true,
      partnerVerification: true
    }
  });

  if (!entity) {
    return NextResponse.json(
      { error: "Not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ entity });
}

