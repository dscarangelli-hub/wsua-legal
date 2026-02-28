import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureCRMEntityForOrganization } from '@/lib/crm-entities';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, location, website, tags } = body;
    if (!name) {
      return NextResponse.json({ error: 'name required' }, { status: 400 });
    }
    const org = await prisma.organization.create({
      data: {
        name,
        type: type ?? null,
        location: location ?? null,
        website: website ?? null,
        tags: Array.isArray(tags) ? tags : [],
      },
    });
    await ensureCRMEntityForOrganization(org.id);
    return NextResponse.json(org);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to create organization' }, { status: 500 });
  }
}
