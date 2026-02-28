import { NextRequest, NextResponse } from "next/server";
import { generateICCULegalFraming } from "@/lib/reparations/iccu-framing";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const jurisdictionIds = body.jurisdictionIds ?? [];
    const framing = await generateICCULegalFraming(params.id, jurisdictionIds);
    return NextResponse.json(framing);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to generate ICCU framing" }, { status: 500 });
  }
}
