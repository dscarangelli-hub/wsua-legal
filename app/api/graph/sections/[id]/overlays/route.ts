import { NextRequest, NextResponse } from 'next/server';
import { getOverlays } from '@/lib/graph/template-api';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const overlays = await getOverlays(id);
  return NextResponse.json(overlays);
}
