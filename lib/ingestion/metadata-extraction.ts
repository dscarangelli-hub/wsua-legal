import type { RawDocument, ExtractedMetadata, SourceMetadata } from "./types";

const CELEX_REGEX = /[0-9]{4}[A-Z]\d{4}\(\d{2}\)|3[0-9]{4}[A-Z]?[0-9]{3,4}/;
const RADA_REGEX = /\d+\s*-\s*[Вв]Р|ВРУ|закон\s*№\s*\d+/i;
const UN_SYMBOL_REGEX = /[A-Z]\/RES\/\d+|S\/RES\/\d+|A\/\d+/;
const CFR_REGEX = /\d+\s*C\.?F\.?R\.?\s*§?\s*[\d.]+|\d+\s*U\.?S\.?C\.?\s*§?\s*\d+/i;

function parseDate(s: string | undefined): string | null {
  if (!s || !s.trim()) return null;
  const d = new Date(s.trim());
  return isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}

function inferLegalLevel(jurisdictionCode: string): string {
  const upper = jurisdictionCode.toUpperCase();
  if (upper === "INTERNATIONAL" || upper.startsWith("UN")) return "international";
  if (upper === "EU") return "regional";
  if (["UA", "US"].includes(upper) || upper.length === 2) return "national";
  if (upper.includes("OBLAST") || upper.includes("CITY") || upper.includes("STATE")) return "subnational";
  return "national";
}

export function extractMetadata(
  raw: RawDocument,
  sourceMetadata?: SourceMetadata | null,
  translationConfidence: number = 0
): ExtractedMetadata {
  const jurisdiction = raw.jurisdictionCode ?? sourceMetadata?.jurisdictionCode ?? "UNKNOWN";
  const legalLevel = raw.legalLevel ?? sourceMetadata?.legalLevel ?? inferLegalLevel(jurisdiction);
  const documentType = raw.documentType ?? sourceMetadata?.documentType ?? "statute";
  const authority = raw.authority ?? sourceMetadata?.authority ?? null;
  const sourceUrl = raw.sourceUrl ?? sourceMetadata?.sourceUrl ?? null;

  const identifiers: Record<string, string> = {};
  if (raw.celexId) identifiers.celex = raw.celexId;
  if (raw.radaId) identifiers.rada = raw.radaId;
  if (raw.unSymbol) identifiers.unSymbol = raw.unSymbol;
  if (raw.cfrCitation) identifiers.cfr = raw.cfrCitation;
  if (raw.externalId) identifiers.externalId = raw.externalId;

  const content = raw.content || "";
  if (!identifiers.celex && CELEX_REGEX.test(content)) {
    const m = content.match(CELEX_REGEX);
    if (m) identifiers.celex = m[0];
  }
  if (!identifiers.rada && RADA_REGEX.test(content)) {
    const m = content.match(/\d+\s*-\s*[Вв]Р|\d+/);
    if (m) identifiers.rada = m[0];
  }
  if (!identifiers.unSymbol && UN_SYMBOL_REGEX.test(content)) {
    const m = content.match(UN_SYMBOL_REGEX);
    if (m) identifiers.unSymbol = m[0];
  }
  if (!identifiers.cfr && CFR_REGEX.test(content)) {
    const m = content.match(CFR_REGEX);
    if (m) identifiers.cfr = m[0];
  }

  return {
    jurisdiction,
    legalLevel: String(legalLevel),
    documentType: String(documentType),
    authority: authority ?? null,
    dateAdopted: parseDate(raw.dateAdopted),
    dateEffective: parseDate(raw.dateEffective),
    dateEffectiveTo: parseDate(raw.dateEffectiveTo),
    sourceUrl,
    translationConfidence,
    languageCode: raw.sourceLanguage ?? "en",
    documentIdentifiers: identifiers,
  };
}
