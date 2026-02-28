import { NextRequest, NextResponse } from "next/server";
import { getScenarioGuidance } from "@/lib/graph/query-layer";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const scenarioId = searchParams.get("scenario") ?? "humanitarian";
  const jurisdictionIds = searchParams.get("jurisdictionIds")?.split(",").filter(Boolean) ?? [];
  const guidance = await getScenarioGuidance(scenarioId, jurisdictionIds);
  return NextResponse.json(guidance);
}
