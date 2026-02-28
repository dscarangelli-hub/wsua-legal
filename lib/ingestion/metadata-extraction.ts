import type { RawDocument, SourceMetadata } from './types';

export function extractMetadata(
  raw: RawDocument,
  sourceMetadata?: SourceMetadata,
  translationConfidence?: number
): Record<string, unknown> {
  const jurisdiction =
    raw.jurisdictionCode ??
    sourceMetadata?.jurisdictionCode ??
    (raw.content.match(/\b(CELEX|EUR-Lex|Ukraine|U\.S\.|CFR)\b/i) ? 'UNKNOWN' : 'UNKNOWN');
  const legalLevel = raw.legalLevel ?? sourceMetadata?.legalLevel ?? inferLegalLevel(jurisdiction);
  const documentType = raw.documentType ?? sourceMetadata?.documentType ?? 'statute';
  const authority = raw.authority ?? '';
  const dateAdopted = raw.dates?.adopted ?? null;
  const dateEffective = raw.dates?.effective ?? null;
  const sourceUrl = raw.sourceUrl ?? sourceMetadata?.sourceUrl ?? '';
  const documentIdentifiers = extractDocumentIdentifiers(raw);
  return {
    jurisdiction,
    legalLevel,
    documentType,
    authority,
    dateAdopted,
    dateEffective,
    sourceUrl,
    translationConfidence: translationConfidence ?? null,
    languageCode: raw.sourceLanguage ?? null,
    ...documentIdentifiers,
  };
}

function inferLegalLevel(jurisdictionCode: string): string {
  const code = (jurisdictionCode ?? '').toUpperCase();
  if (code === 'INTERNATIONAL' || code.startsWith('UN')) return 'international';
  if (code === 'EU') return 'regional';
  if (['UA', 'US'].includes(code)) return 'national';
  if (code.includes('OBLAST') || code.includes('CITY') || code.includes('STATE'))
    return 'subnational';
  return 'national';
}

function extractDocumentIdentifiers(raw: RawDocument): Record<string, string | null> {
  const content = raw.content + (raw.title ?? '');
  const celex = raw.celexId ?? content.match(/([0-9]{4}[A-Z]\d{4})/)?.[1] ?? null;
  const radaId = raw.radaId ?? content.match(/(\d+\/?\d*-?[ВВРП]\d*)/)?.[1] ?? null;
  const unSymbol = raw.unSymbol ?? content.match(/([A-Z]/RES\/\d+\/\d+)/)?.[1] ?? null;
  const cfrCitation = raw.cfrCitation ?? content.match(/(\d+\s+CFR\s+[\d.]+)/)?.[1] ?? null;
  return {
    celexId: celex,
    radaId,
    unSymbol,
    cfrCitation,
    externalId: raw.externalId ?? null,
  };
}
