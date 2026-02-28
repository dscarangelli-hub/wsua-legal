import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureCRMEntityForPerson } from "@/lib/crm-entities";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      location,
      socialHandles,
      tags,
      trustScore,
      riskFlags
    } = body;

    const person = await prisma.person.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        location,
        socialHandles: socialHandles ?? null,
        tags: tags ?? [],
        trustScore: trustScore ?? 0,
        riskFlags: riskFlags ?? []
      }
    });

    const crmEntity = await ensureCRMEntityForPerson(person);

    return NextResponse.json(
      { person, crmEntity },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create person" },
      { status: 500 }
    );
  }
}

