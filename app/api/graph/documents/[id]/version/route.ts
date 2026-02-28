import { NextRequest, NextResponse } from 'next/server';
import { updateDocumentVersion } from '@/lib/graph/ingestion';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { normalizedText, contentDelta, changeSummary, module } = body;
    if (!module) {
      return NextResponse.json({ error: 'module required' }, { status: 400 });
    }
    const result = await updateDocumentVersion(
      id,
      { normalizedText, contentDelta, changeSummary },
      module
    );
    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to update version' }, { status: 500 });
  }
}
