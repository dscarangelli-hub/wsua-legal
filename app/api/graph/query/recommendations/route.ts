import { NextRequest, NextResponse } from "next/server";
import { getTemplateRecommendations } from "@/lib/graph/query-layer";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const scenarioTag = searchParams.get("scenario") ?? "humanitarian";
  const jurisdictionIds = searchParams.get("jurisdictionIds")?.split(",").filter(Boolean) ?? [];
  const templates = await getTemplateRecommendations(scenarioTag, jurisdictionIds);
  return NextResponse.json({ templates });
}
