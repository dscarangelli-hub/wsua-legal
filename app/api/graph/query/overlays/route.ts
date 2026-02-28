import { NextRequest, NextResponse } from "next/server";
import { getOverlaysForJurisdiction } from "@/lib/graph/query-layer";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const jurisdictionId = searchParams.get("jurisdictionId");
  const templateId = searchParams.get("templateId") ?? undefined;
  if (!jurisdictionId) {
    return NextResponse.json({ error: "jurisdictionId required" }, { status: 400 });
  }
  const overlays = await getOverlaysForJurisdiction(jurisdictionId, templateId);
  return NextResponse.json({ overlays });
}
