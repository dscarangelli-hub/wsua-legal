/**
 * Ingestion API — POST ingestDocument. Returns normalized output; caller writes to graph.
 */

import { NextRequest, NextResponse } from "next/server";
import { ingestDocument } from "@/lib/ingestion";
import type { RawDocument, SourceMetadata } from "@/lib/ingestion";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const raw = body.raw_document as RawDocument;
    const sourceMetadata = body.source_metadata as SourceMetadata | undefined;
    const generateId = body.generate_id !== false;

    if (!raw?.content) {
      return NextResponse.json(
        { success: false, errors: ["Missing raw_document.content"], warnings: [] },
        { status: 400 }
      );
    }

    const result = await ingestDocument(raw, sourceMetadata ?? null, { generateId });

    if (!result.success) {
      return NextResponse.json(result, { status: 422 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (e) {
    console.error("[ingestion]", e);
    return NextResponse.json(
      { success: false, errors: ["Ingestion failed"], warnings: [] },
      { status: 500 }
    );
  }
}
