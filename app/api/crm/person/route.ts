import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureCRMEntityForPerson } from '@/lib/crm-entities';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, location, socialHandles, tags, trustScore, riskFlags } = body;
    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: 'firstName and lastName required' },
        { status: 400 }
      );
    }
    const person = await prisma.person.create({
      data: {
        firstName,
        lastName,
        email: email ?? null,
        phone: phone ?? null,
        location: location ?? null,
        socialHandles: socialHandles ?? undefined,
        tags: Array.isArray(tags) ? tags : [],
        trustScore: trustScore != null ? Number(trustScore) : null,
        riskFlags: Array.isArray(riskFlags) ? riskFlags : [],
      },
    });
    await ensureCRMEntityForPerson(person.id);
    return NextResponse.json(person);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to create person' }, { status: 500 });
  }
}
