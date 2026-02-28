import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureCRMEntityForPartnerVerification } from '@/lib/crm-entities';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { status, notes } = body;
    const verification = await prisma.partnerVerification.create({
      data: {
        status: status ?? null,
        notes: notes ?? null,
      },
    });
    await ensureCRMEntityForPartnerVerification(verification.id);
    return NextResponse.json(verification);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to create partner verification' }, { status: 500 });
  }
}
