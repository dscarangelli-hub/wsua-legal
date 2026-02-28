import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const claims = await prisma.claim.findMany({
    include: { rd4uCategory: { select: { categoryId: true, title: true } }, _count: { select: { evidence: true } } },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json({ claims });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, rd4uCategoryId, narrative, timeline } = body;
    if (!title || !rd4uCategoryId) {
      return NextResponse.json({ error: "title and rd4uCategoryId required" }, { status: 400 });
    }
    const claim = await prisma.claim.create({
      data: {
        title,
        status: "draft",
        rd4uCategoryId,
        narrative: narrative ?? undefined,
        timeline: timeline ?? undefined,
      },
    });
    return NextResponse.json(claim, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create claim" }, { status: 500 });
  }
}
