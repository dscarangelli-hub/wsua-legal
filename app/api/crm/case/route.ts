import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureCRMEntityForCase } from '@/lib/crm-entities';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, type, status } = body;
    if (!title) {
      return NextResponse.json({ error: 'title required' }, { status: 400 });
    }
    const c = await prisma.case.create({
      data: {
        title,
        type: type ?? null,
        status: status ?? null,
      },
    });
    await ensureCRMEntityForCase(c.id);
    return NextResponse.json(c);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to create case' }, { status: 500 });
  }
}
