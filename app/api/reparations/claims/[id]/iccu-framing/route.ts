import { NextRequest, NextResponse } from 'next/server';
import { generateICCULegalFraming, saveICCUFraming } from '@/lib/reparations/iccu-framing';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const framing = await generateICCULegalFraming(id);
    return NextResponse.json(framing);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Claim not found' }, { status: 404 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const framing = await generateICCULegalFraming(id);
    await saveICCUFraming(id, framing);
    return NextResponse.json(framing);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to save framing' }, { status: 500 });
  }
}
