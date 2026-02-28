import { NextRequest, NextResponse } from 'next/server';
import { getTemplateSections } from '@/lib/graph/template-api';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sections = await getTemplateSections(id);
  return NextResponse.json(sections);
}
