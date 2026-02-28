import { NextRequest, NextResponse } from 'next/server';
import { getOverlaysForJurisdiction } from '@/lib/graph/query-layer';

export async function GET(request: NextRequest) {
  const jurisdictionId = request.nextUrl.searchParams.get('jurisdictionId') ?? '';
  const templateId = request.nextUrl.searchParams.get('templateId') ?? undefined;
  if (!jurisdictionId) {
    return NextResponse.json({ error: 'jurisdictionId required' }, { status: 400 });
  }
  const list = await getOverlaysForJurisdiction(jurisdictionId, templateId);
  return NextResponse.json(list);
}
