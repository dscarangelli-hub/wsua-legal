import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fromId, toId, type } = body;
    if (!fromId || !toId || !type) {
      return NextResponse.json(
        { error: 'fromId, toId, and type required' },
        { status: 400 }
      );
    }
    const rel = await prisma.relationship.create({
      data: { fromId, toId, type },
    });
    return NextResponse.json(rel);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to create relationship' }, { status: 500 });
  }
}
