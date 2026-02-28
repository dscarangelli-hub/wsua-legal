import { NextRequest, NextResponse } from "next/server";
import { getTemplatesForScenario } from "@/lib/graph/query-layer";

export async function GET(
  req: NextRequest,
  { params }: { params: { tag: string } }
) {
  const { searchParams } = new URL(req.url);
  const jurisdictionIds = searchParams.get("jurisdictionIds")?.split(",").filter(Boolean) ?? [];
  const limit = Math.min(Number(searchParams.get("limit")) || 20, 100);
  const templates = await getTemplatesForScenario(params.tag, jurisdictionIds, { limit });
  return NextResponse.json({ templates });
}
