import { NextRequest, NextResponse } from 'next/server';
import { getObligationsByJurisdiction } from '@/lib/graph/query-layer';

export async function GET(request: NextRequest) {
  const jurisdictionIds = request.nextUrl.searchParams.get('jurisdictionIds')?.split(',').filter(Boolean) ?? [];
  const limit = Number(request.nextUrl.searchParams.get('limit')) || 50;
  const offset = Number(request.nextUrl.searchParams.get('offset')) || 0;
  const list = await getObligationsByJurisdiction(jurisdictionIds, { limit, offset });
  return NextResponse.json(list);
}
