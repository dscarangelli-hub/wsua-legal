import { NextRequest, NextResponse } from 'next/server';
import { searchLegalDocuments } from '@/lib/graph/query-layer';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') ?? '';
  const jurisdictionIds = request.nextUrl.searchParams.get('jurisdictionIds')?.split(',').filter(Boolean) ?? [];
  const limit = Number(request.nextUrl.searchParams.get('limit')) || 20;
  const list = await searchLegalDocuments(q, jurisdictionIds, { limit });
  return NextResponse.json(list);
}
