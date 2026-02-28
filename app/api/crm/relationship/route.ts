import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fromId, toId, type } = body;

    const relationship = await prisma.relationship.create({
      data: {
        fromId,
        toId,
        type
      }
    });

    return NextResponse.json(
      { relationship },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create relationship" },
      { status: 500 }
    );
  }
}

