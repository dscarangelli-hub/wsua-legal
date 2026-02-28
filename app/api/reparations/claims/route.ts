import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const status = request.nextUrl.searchParams.get('status');
  const where = status ? { status } : {};
  const list = await prisma.claim.findMany({
    where,
    include: { category: true },
    orderBy: { updatedAt: 'desc' },
  });
  return NextResponse.json(list);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      rd4uCategoryId,
      title,
      status,
      eligibilityMetadata,
      paymentReadiness,
      narrative,
      harmClassification,
      timelineJson,
      iccuFramingJson,
      rd4uMetadata,
    } = body;
    if (!title) {
      return NextResponse.json({ error: 'title required' }, { status: 400 });
    }
    const claim = await prisma.claim.create({
      data: {
        rd4uCategoryId: rd4uCategoryId ?? null,
        title,
        status: status ?? 'draft',
        eligibilityMetadata: (eligibilityMetadata ?? null) as object | null,
        paymentReadiness: paymentReadiness ?? null,
        narrative: narrative ?? null,
        harmClassification: harmClassification ?? null,
        timelineJson: (timelineJson ?? null) as object | null,
        iccuFramingJson: (iccuFramingJson ?? null) as object | null,
        rd4uMetadata: (rd4uMetadata ?? null) as object | null,
      },
    });
    return NextResponse.json(claim);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to create claim' }, { status: 500 });
  }
}
