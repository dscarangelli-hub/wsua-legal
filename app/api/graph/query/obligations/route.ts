import { NextRequest, NextResponse } from "next/server";
import { getObligationsByJurisdiction } from "@/lib/graph/query-layer";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const jurisdictionIds = searchParams.get("jurisdictionIds")?.split(",").filter(Boolean) ?? [];
  const limit = Math.min(Number(searchParams.get("limit")) || 50, 100);
  const offset = Number(searchParams.get("offset")) || 0;
  const obligations = await getObligationsByJurisdiction(jurisdictionIds, { limit, offset });
  return NextResponse.json({ obligations });
}
