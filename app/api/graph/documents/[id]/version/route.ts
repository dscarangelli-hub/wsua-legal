import { NextRequest, NextResponse } from "next/server";
import { updateDocumentVersion } from "@/lib/graph/ingestion";
import type { LegalModule } from "@/lib/legal/types";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const documentId = params.id;
    const body = await req.json();
    const { normalizedText, contentDelta, changeSummary, module } = body;
    if (!module) {
      return NextResponse.json({ error: "module required" }, { status: 400 });
    }
    const result = await updateDocumentVersion(
      { documentId, normalizedText, contentDelta, changeSummary },
      module as LegalModule
    );
    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update document version" }, { status: 500 });
  }
}
