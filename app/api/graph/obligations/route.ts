import { NextRequest, NextResponse } from "next/server";
import { addObligation } from "@/lib/graph/ingestion";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { documentId, text, scope, jurisdictionId, legalBasis } = body;
    if (!documentId || !text) {
      return NextResponse.json(
        { error: "Missing required: documentId, text" },
        { status: 400 }
      );
    }
    const result = await addObligation({
      documentId,
      text,
      scope,
      jurisdictionId,
      legalBasis,
    });
    return NextResponse.json(result, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to add obligation" }, { status: 500 });
  }
}
