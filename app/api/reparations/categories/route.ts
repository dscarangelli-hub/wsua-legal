import { NextRequest, NextResponse } from 'next/server';
import { getRd4uCategories, upsertRd4uCategory } from '@/lib/reparations/rd4u-categories';

export async function GET() {
  const list = await getRd4uCategories();
  return NextResponse.json(list);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { categoryId, title, description, eligibilityCriteria, requiredEvidence, narrativeStructure, metadata } = body;
    if (!categoryId || !title) {
      return NextResponse.json(
        { error: 'categoryId and title required' },
        { status: 400 }
      );
    }
    const category = await upsertRd4uCategory({
      categoryId,
      title,
      description,
      eligibilityCriteria,
      requiredEvidence: Array.isArray(requiredEvidence) ? requiredEvidence : [],
      narrativeStructure,
      metadata,
    });
    return NextResponse.json(category);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to upsert category' }, { status: 500 });
  }
}
