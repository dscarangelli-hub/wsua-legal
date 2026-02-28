import { NextRequest, NextResponse } from 'next/server';
import { isSelectorComplete } from '@/lib/legal/selector-contract';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { query, jurisdictionIds, scenarioTag, mode = 'summary' } = body;
    const disclaimer =
      'Research only; not legal advice; no drafting of binding legal documents.';

    const result: Record<string, unknown> = {
      query: query ?? '',
      mode,
      jurisdictionIds: jurisdictionIds ?? [],
      scenarioTag: scenarioTag ?? null,
      disclaimer,
      summary: null,
      obligations: null,
      compliance: null,
      comparison: null,
      conflict: null,
      templates: null,
      scenario: null,
    };

    switch (mode) {
      case 'summary':
        result.summary = { text: 'Summary placeholder for: ' + (query ?? '') };
        break;
      case 'obligations':
        result.obligations = [];
        break;
      case 'compliance':
        result.compliance = [];
        break;
      case 'comparison':
        result.comparison = [];
        break;
      case 'conflict':
        result.conflict = [];
        break;
      case 'templates':
        result.templates = [];
        break;
      case 'scenario':
        result.scenario = { tag: scenarioTag, guidance: [] };
        break;
      default:
        result.summary = { text: 'Mode: ' + mode };
    }

    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: 'Research failed' },
      { status: 500 }
    );
  }
}
