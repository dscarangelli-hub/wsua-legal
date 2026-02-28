import { NextRequest, NextResponse } from 'next/server';
import { updateOverlay } from '@/lib/graph/template-api';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { overlayText } = body;
    if (typeof overlayText !== 'string') {
      return NextResponse.json({ error: 'overlayText required' }, { status: 400 });
    }
    const updated = await updateOverlay(id, overlayText);
    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to update overlay' }, { status: 500 });
  }
}
