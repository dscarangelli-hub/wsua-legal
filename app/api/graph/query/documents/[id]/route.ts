import { NextRequest, NextResponse } from "next/server";
import { getLegalDocument } from "@/lib/graph/query-layer";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const doc = await getLegalDocument(params.id);
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(doc);
}
