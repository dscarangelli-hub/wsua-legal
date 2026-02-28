import { NextRequest, NextResponse } from "next/server";
import { traceObligationFlow } from "@/lib/graph/query-layer";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const flow = await traceObligationFlow(params.id);
  if (!flow) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(flow);
}
