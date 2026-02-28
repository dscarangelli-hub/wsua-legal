import { NextRequest, NextResponse } from 'next/server';
import { createEvidence } from '@/lib/reparations/evidence-pipeline';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      claimId,
      type,
      storagePath,
      timestamps,
      geolocation,
      rd4uCategoryId,
      harmNarrative,
      chainOfCustody,
      metadata,
    } = body;
    if (!type) {
      return NextResponse.json({ error: 'type required' }, { status: 400 });
    }
    const evidence = await createEvidence({
      claimId,
      type,
      storagePath,
      timestamps,
      geolocation,
      rd4uCategoryId,
      harmNarrative,
      chainOfCustody,
      metadata,
    });
    return NextResponse.json(evidence);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to create evidence' }, { status: 500 });
  }
}
