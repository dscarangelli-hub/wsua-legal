import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureCRMEntityForOrganization } from "@/lib/crm-entities";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, type, location, website, tags } = body;

    const organization = await prisma.organization.create({
      data: {
        name,
        type,
        location,
        website,
        tags: tags ?? []
      }
    });

    const crmEntity = await ensureCRMEntityForOrganization(organization);

    return NextResponse.json(
      { organization, crmEntity },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create organization" },
      { status: 500 }
    );
  }
}

