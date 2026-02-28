import { prisma } from '@/lib/prisma';
import { getDetectedCodes, classifyJurisdictions } from './jurisdiction-classifier';
import type { SelectorResult, JurisdictionItem } from './selector-contract';
import type { LegalModule } from './types';

async function getJurisdictionsByCodes(codes: string[]): Promise<JurisdictionItem[]> {
  if (codes.length === 0) return [];
  const list = await prisma.jurisdiction.findMany({
    where: { code: { in: codes } },
  });
  return list.map((j) => ({ id: j.id, code: j.code, name: j.name }));
}

export async function resolveSelector(params: {
  query?: string;
  explicit_jurisdiction_ids?: string[];
}): Promise<SelectorResult> {
  if (params.explicit_jurisdiction_ids?.length) {
    const list = await prisma.jurisdiction.findMany({
      where: { id: { in: params.explicit_jurisdiction_ids } },
    });
    const items: JurisdictionItem[] = list.map((j) => ({
      id: j.id,
      code: j.code,
      name: j.name,
    }));
    return {
      mode: 'explicit',
      detected_jurisdictions: items,
      requires_confirmation: false,
      confirmed_jurisdictions: items,
    };
  }

  const query = (params.query ?? '').trim();
  if (!query) {
    return {
      mode: 'agnostic',
      detected_jurisdictions: [],
      requires_confirmation: false,
      confirmed_jurisdictions: null,
    };
  }

  const codes = getDetectedCodes(query, 50);
  const classified = classifyJurisdictions(query);
  const items = await getJurisdictionsByCodes(codes);
  const detected = items.length
    ? items
    : await getJurisdictionsByCodes(classified.slice(0, 5).map((c) => c.code));

  if (detected.length === 0) {
    return {
      mode: 'agnostic',
      detected_jurisdictions: [],
      requires_confirmation: false,
      confirmed_jurisdictions: null,
    };
  }

  if (detected.length === 1) {
    return {
      mode: 'agnostic',
      detected_jurisdictions: detected,
      requires_confirmation: false,
      confirmed_jurisdictions: detected,
    };
  }

  const confirmation_prompt =
    'This query appears to involve the following jurisdictions: ' +
    detected.map((j) => j.code).join(', ') +
    '. Confirm whether the analysis should include all listed jurisdictions or be limited to a specific one.';

  return {
    mode: 'agnostic',
    detected_jurisdictions: detected,
    requires_confirmation: true,
    confirmed_jurisdictions: null,
    confirmation_prompt,
  };
}

export async function confirmSelector(params: {
  selected_jurisdiction_ids: string[];
  query?: string;
}): Promise<SelectorResult> {
  const list = await prisma.jurisdiction.findMany({
    where: { id: { in: params.selected_jurisdiction_ids } },
  });
  const confirmed: JurisdictionItem[] = list.map((j) => ({
    id: j.id,
    code: j.code,
    name: j.name,
  }));
  return {
    mode: 'agnostic',
    detected_jurisdictions: confirmed,
    requires_confirmation: false,
    confirmed_jurisdictions: confirmed,
  };
}

const CODE_TO_MODULE: Record<string, LegalModule> = {
  INTERNATIONAL: 'INTERNATIONAL',
  EU: 'EU',
  UA: 'UKRAINE',
  UA_OBLAST: 'UKRAINE',
  UA_CITY: 'UKRAINE',
  US: 'US',
  US_CIRCUIT: 'US',
  US_STATE: 'US',
};

export function getModulesForConfirmedJurisdictions(
  confirmed: JurisdictionItem[]
): LegalModule[] {
  const set = new Set<LegalModule>();
  for (const j of confirmed) {
    const mod = CODE_TO_MODULE[j.code];
    if (mod) set.add(mod);
  }
  return [...set];
}
