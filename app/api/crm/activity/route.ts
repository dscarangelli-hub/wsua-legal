import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureCRMEntityForActivity } from "@/lib/crm-entities";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, timestamp, description, metadata } = body;

    const activity = await prisma.activity.create({
      data: {
        type,
        timestamp: new Date(timestamp),
        description,
        metadata: metadata ?? null
      }
    });

    const crmEntity = await ensureCRMEntityForActivity(activity);

    return NextResponse.json(
      { activity, crmEntity },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create activity" },
      { status: 500 }
    );
  }
}

