import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureCRMEntityForCase } from "@/lib/crm-entities";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, type, status } = body;

    const createdCase = await prisma.case.create({
      data: {
        title,
        type,
        status
      }
    });

    const crmEntity = await ensureCRMEntityForCase(createdCase);

    return NextResponse.json(
      { case: createdCase, crmEntity },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create case" },
      { status: 500 }
    );
  }
}

