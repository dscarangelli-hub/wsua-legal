import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const jurisdictions = await prisma.jurisdiction.findMany({
    orderBy: [{ layer: "asc" }, { name: "asc" }],
    include: {
      parent: { select: { id: true, code: true, name: true } },
      _count: { select: { legalDocuments: true, templates: true } },
    },
  });
  return NextResponse.json({ jurisdictions });
}
