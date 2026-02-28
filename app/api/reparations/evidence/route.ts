import { NextRequest, NextResponse } from "next/server";
import { ingestEvidence } from "@/lib/reparations/evidence-pipeline";

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.claimId || !body.type) {
    return NextResponse.json({ error: "claimId and type required" }, { status: 400 });
  }
  const result = await ingestEvidence(body);
  return NextResponse.json(result, { status: 201 });
}
