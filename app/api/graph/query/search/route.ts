import { NextRequest, NextResponse } from "next/server";
import { searchLegalDocuments } from "@/lib/graph/query-layer";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const jurisdictionIds = searchParams.get("jurisdictionIds")?.split(",").filter(Boolean) ?? [];
  const limit = Math.min(Number(searchParams.get("limit")) || 30, 100);
  if (!q.trim()) {
    return NextResponse.json({ error: "q required" }, { status: 400 });
  }
  const documents = await searchLegalDocuments(q, jurisdictionIds, { limit });
  return NextResponse.json({ documents });
}
