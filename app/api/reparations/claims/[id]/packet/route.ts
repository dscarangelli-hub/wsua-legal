import { NextRequest, NextResponse } from 'next/server';
import { generateClaimPacketPayload, createClaimPacketRecord } from '@/lib/reparations/claim-packet';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json().catch(() => ({}));
    const format = (body.format ?? 'json') as 'json' | 'pdf' | 'xml';
    const locale = (body.locale ?? 'en') as 'en' | 'uk';
    const payload = await generateClaimPacketPayload(id, locale);
    const record = await createClaimPacketRecord(id, format, null, locale);
    return NextResponse.json({
      claimId: id,
      packetId: record.id,
      format,
      locale,
      payload: format === 'json' ? payload : undefined,
      message: format === 'pdf' || format === 'xml' ? 'Export to PDF/XML: use payload to generate file' : undefined,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to generate packet' }, { status: 500 });
  }
}
