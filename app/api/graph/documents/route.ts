import { NextRequest, NextResponse } from 'next/server';
import { addLegalDocument } from '@/lib/graph/ingestion';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { module, title, documentType, jurisdictionId, rawContent, normalizedContent, legalLevel, authority, dateAdopted, dateEffective, originalLanguage, sourceUrl, externalId } = body;
    if (!module || !title || !documentType) {
      return NextResponse.json(
        { error: 'module, title, documentType required' },
        { status: 400 }
      );
    }
    const result = await addLegalDocument(
      {
        title,
        documentType,
        jurisdictionId,
        module,
        rawContent,
        normalizedContent,
        legalLevel,
        authority,
        dateAdopted: dateAdopted ? new Date(dateAdopted) : undefined,
        dateEffective: dateEffective ? new Date(dateEffective) : undefined,
        originalLanguage,
        sourceUrl,
        externalId,
      },
      module
    );
    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to add document' }, { status: 500 });
  }
}
