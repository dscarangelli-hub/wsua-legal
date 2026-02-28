import { NextRequest, NextResponse } from "next/server";
import { getOverlays } from "@/lib/graph/template-api";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const overlays = await getOverlays(params.id);
  return NextResponse.json({ overlays });
}
