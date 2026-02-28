import { NextRequest, NextResponse } from 'next/server';
import { addObligation } from '@/lib/graph/ingestion';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { documentId, text, scope, jurisdictionId, legalBasis } = body;
    if (!documentId || !text) {
      return NextResponse.json(
        { error: 'documentId and text required' },
        { status: 400 }
      );
    }
    const obligation = await addObligation({
      documentId,
      text,
      scope,
      jurisdictionId,
      legalBasis,
    });
    return NextResponse.json(obligation);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to add obligation' }, { status: 500 });
  }
}
