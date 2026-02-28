import { NextRequest, NextResponse } from "next/server";
import { updateOverlay } from "@/lib/graph/template-api";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { overlayText } = body;
    if (typeof overlayText !== "string") {
      return NextResponse.json({ error: "overlayText required" }, { status: 400 });
    }
    const result = await updateOverlay(params.id, overlayText);
    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update overlay" }, { status: 500 });
  }
}
