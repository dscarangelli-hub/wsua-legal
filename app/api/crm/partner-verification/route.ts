import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureCRMEntityForPartnerVerification } from "@/lib/crm-entities";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { status, notes } = body;

    const verification = await prisma.partnerVerification.create({
      data: {
        status,
        notes
      }
    });

    const crmEntity = await ensureCRMEntityForPartnerVerification(verification);

    return NextResponse.json(
      { verification, crmEntity },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create partner verification" },
      { status: 500 }
    );
  }
}

