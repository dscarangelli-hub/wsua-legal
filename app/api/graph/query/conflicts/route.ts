import { NextRequest, NextResponse } from "next/server";
import { detectConflicts } from "@/lib/graph/query-layer";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const jurisdictionIds = searchParams.get("jurisdictionIds")?.split(",").filter(Boolean) ?? [];
  const limit = Math.min(Number(searchParams.get("limit")) || 50, 100);
  const conflicts = await detectConflicts(jurisdictionIds, limit);
  return NextResponse.json({ conflicts });
}
