import { NextRequest, NextResponse } from 'next/server';
import { getLegalDocument } from '@/lib/graph/query-layer';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const doc = await getLegalDocument(id);
  if (!doc) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 });
  }
  return NextResponse.json(doc);
}
