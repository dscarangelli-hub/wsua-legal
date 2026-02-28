import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureCRMEntityForActivity } from '@/lib/crm-entities';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, timestamp, description, metadata } = body;
    if (!type) {
      return NextResponse.json({ error: 'type required' }, { status: 400 });
    }
    const activity = await prisma.activity.create({
      data: {
        type,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
        description: description ?? null,
        metadata: metadata ?? undefined,
      },
    });
    await ensureCRMEntityForActivity(activity.id);
    return NextResponse.json(activity);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 });
  }
}
