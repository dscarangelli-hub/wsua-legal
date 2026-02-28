import { NextRequest, NextResponse } from 'next/server';
import { createTemplateVersion } from '@/lib/graph/template-api';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { changeReason, changeLog, delta } = body;
    const result = await createTemplateVersion(id, {
      changeReason,
      changeLog,
      delta,
    });
    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to create template version' }, { status: 500 });
  }
}
