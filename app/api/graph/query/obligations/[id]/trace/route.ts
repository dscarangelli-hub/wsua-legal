import { NextRequest, NextResponse } from 'next/server';
import { traceObligationFlow } from '@/lib/graph/query-layer';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await traceObligationFlow(id);
  if (!result) {
    return NextResponse.json({ error: 'Obligation not found' }, { status: 404 });
  }
  return NextResponse.json(result);
}
