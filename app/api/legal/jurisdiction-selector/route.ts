import { NextRequest, NextResponse } from 'next/server';
import { resolveSelector } from '@/lib/legal/jurisdiction-selector';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const result = await resolveSelector({
      query: body.query,
      explicit_jurisdiction_ids: body.explicit_jurisdiction_ids,
    });
    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: 'Jurisdiction selector failed' },
      { status: 500 }
    );
  }
}
