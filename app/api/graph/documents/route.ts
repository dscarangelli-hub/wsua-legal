import { NextRequest, NextResponse } from "next/server";
import { addLegalDocument } from "@/lib/graph/ingestion";
import type { LegalModule } from "@/lib/legal/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { module, ...document } = body;
    if (!module || !document.title || !document.documentType || !document.jurisdictionId) {
      return NextResponse.json(
        { error: "Missing required: module, title, documentType, jurisdictionId" },
        { status: 400 }
      );
    }
    const result = await addLegalDocument(document, module as LegalModule);
    return NextResponse.json(result, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to add legal document" }, { status: 500 });
  }
}
