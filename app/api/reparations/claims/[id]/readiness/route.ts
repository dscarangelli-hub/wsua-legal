import { NextRequest, NextResponse } from "next/server";
import { getCompensationReadiness } from "@/lib/reparations/compensation-readiness";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const summary = await getCompensationReadiness(params.id);
    return NextResponse.json(summary);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Claim not found" }, { status: 404 });
  }
}
