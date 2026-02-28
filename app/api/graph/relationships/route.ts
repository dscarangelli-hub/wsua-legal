import { NextRequest, NextResponse } from 'next/server';
import { addRelationship } from '@/lib/graph/ingestion';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sourceType, sourceId, targetType, targetId, relationshipType, metadata, module } = body;
    if (!sourceType || !sourceId || !targetType || !targetId || !relationshipType) {
      return NextResponse.json(
        { error: 'sourceType, sourceId, targetType, targetId, relationshipType required' },
        { status: 400 }
      );
    }
    const edge = await addRelationship(
      { sourceType, sourceId, targetType, targetId, relationshipType, metadata },
      metadata
    );
    return NextResponse.json(edge);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to add relationship' }, { status: 500 });
  }
}
