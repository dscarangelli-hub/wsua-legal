import { NextRequest, NextResponse } from 'next/server';
import { getTemplatesForScenario } from '@/lib/graph/query-layer';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tag: string }> }
) {
  const { tag } = await params;
  const jurisdictionIds = request.nextUrl.searchParams.get('jurisdictionIds')?.split(',').filter(Boolean) ?? [];
  const list = await getTemplatesForScenario(tag, jurisdictionIds);
  return NextResponse.json(list);
}
