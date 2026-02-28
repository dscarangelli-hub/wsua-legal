import { NextRequest, NextResponse } from 'next/server';
import { confirmSelector } from '@/lib/legal/jurisdiction-selector';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { selected_jurisdiction_ids, query } = body;
    if (!Array.isArray(selected_jurisdiction_ids)) {
      return NextResponse.json(
        { error: 'selected_jurisdiction_ids required' },
        { status: 400 }
      );
    }
    const result = await confirmSelector({
      selected_jurisdiction_ids,
      query,
    });
    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: 'Confirmation failed' },
      { status: 500 }
    );
  }
}
