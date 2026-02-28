import { NextRequest, NextResponse } from 'next/server';
import { ingestDocument } from '@/lib/ingestion/pipeline';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const raw_document = body.raw_document ?? body;
    const source_metadata = body.source_metadata;
    const generate_id = body.generate_id !== false;
    if (!raw_document?.content) {
      return NextResponse.json(
        { success: false, errors: ['raw_document.content is required'] },
        { status: 400 }
      );
    }
    const result = ingestDocument(raw_document, source_metadata, { generate_id });
    if (!result.success) {
      return NextResponse.json(result, { status: 422 });
    }
    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { success: false, errors: ['Ingestion failed'] },
      { status: 500 }
    );
  }
}
