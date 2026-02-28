import { NextRequest, NextResponse } from "next/server";
import { generateClaimPacket } from "@/lib/reparations/packet-generator";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { format = "json", language = "en", jurisdictionIds = [] } = body;
    const result = await generateClaimPacket(
      params.id,
      format,
      language,
      Array.isArray(jurisdictionIds) ? jurisdictionIds : []
    );
    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to generate packet" }, { status: 500 });
  }
}
