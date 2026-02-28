import { NextRequest, NextResponse } from 'next/server';
import { getTemplate } from '@/lib/graph/template-api';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const template = await getTemplate(id);
  if (!template) {
    return NextResponse.json({ error: 'Template not found' }, { status: 404 });
  }
  return NextResponse.json(template);
}
