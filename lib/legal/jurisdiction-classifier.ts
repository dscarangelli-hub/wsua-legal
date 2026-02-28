export interface JurisdictionSignal {
  kind: string;
  match: string;
  score: number;
}

export interface ClassifiedJurisdiction {
  code: string;
  score: number;
  signals: JurisdictionSignal[];
}

const CITATION_PATTERNS: Array<{ pattern: RegExp; code: string; score: number }> = [
  { pattern: /\b(CFR|Code of Federal Regulations)\b/i, code: 'US', score: 90 },
  { pattern: /\b(U\.?S\.?C\.?|U\.?S\.? Code)\b/i, code: 'US', score: 90 },
  { pattern: /\bCELEX|EUR-Lex|TEU|TFEU\b/i, code: 'EU', score: 90 },
  { pattern: /\bECHR|European Convention\b/i, code: 'EU', score: 85 },
  { pattern: /\b(UNSC|UN Security Council|UN resolution)\b/i, code: 'INTERNATIONAL', score: 90 },
  { pattern: /\b(ICJ|ICC|International Court)\b/i, code: 'INTERNATIONAL', score: 90 },
  { pattern: /\b(Geneva Convention|IHL|international humanitarian)\b/i, code: 'INTERNATIONAL', score: 85 },
  { pattern: /\b(Закон|Кодекс|постанова КМУ|постанова ВРУ)\b/, code: 'UA', score: 90 },
  { pattern: /\b(наказ Мін|міністерств)\b/, code: 'UA', score: 85 },
  { pattern: /\b(обласна рада|міська рада|КМДА)\b/, code: 'UA_OBLAST', score: 75 },
  { pattern: /\b(oblast|oblast council)\b/i, code: 'UA_OBLAST', score: 60 },
  { pattern: /\b(city council|міська)\b/i, code: 'UA_CITY', score: 60 },
  { pattern: /\b(\d+)(th|st|nd|rd)\s+Circuit\b/i, code: 'US_CIRCUIT', score: 85 },
  { pattern: /\b(F\.2d|F\.3d|Fed\.)\b/i, code: 'US_CIRCUIT', score: 80 },
  { pattern: /\b(Cal\.|N\.?Y\.?|state statute|state law)\b/i, code: 'US_STATE', score: 75 },
];

const INSTITUTION_PATTERNS: Array<{ pattern: RegExp; code: string; score: number }> = [
  { pattern: /\b(CJEU|ECJ|European Court of Justice)\b/i, code: 'EU', score: 85 },
  { pattern: /\b(Верховний Суд|Supreme Court of Ukraine)\b/i, code: 'UA', score: 90 },
  { pattern: /\b(Constitutional Court of Ukraine)\b/i, code: 'UA', score: 85 },
  { pattern: /\b(9th Circuit|First Circuit|circuit court)\b/i, code: 'US_CIRCUIT', score: 80 },
  { pattern: /\b(state supreme court)\b/i, code: 'US_STATE', score: 70 },
];

const CONTEXT_KEYWORDS: Array<{ keywords: RegExp; code: string; score: number }> = [
  { keywords: /\b(GDPR|EU grant|EU regulation)\b/i, code: 'EU', score: 70 },
  { keywords: /\b(humanitarian|sanctions|NGO)\b/i, code: 'INTERNATIONAL', score: 50 },
  { keywords: /\b(Ukraine|Ukrainian)\b/i, code: 'UA', score: 60 },
];

function detectCyrillic(text: string): { code: string; score: number } | null {
  if (!/[а-яіїєґ]/i.test(text)) return null;
  const ukSpecific = /[іїєґ]/i.test(text);
  return { code: 'UA', score: ukSpecific ? 80 : 65 };
}

export function classifyJurisdictions(query: string): ClassifiedJurisdiction[] {
  const byCode: Record<string, { score: number; signals: JurisdictionSignal[] }> = {};
  const add = (code: string, score: number, kind: string, match: string) => {
    if (!byCode[code]) byCode[code] = { score: 0, signals: [] };
    byCode[code].score += score;
    byCode[code].signals.push({ kind, match, score });
  };

  for (const { pattern, code, score } of CITATION_PATTERNS) {
    const m = query.match(pattern);
    if (m) add(code, score, 'citation', m[0]);
  }
  for (const { pattern, code, score } of INSTITUTION_PATTERNS) {
    const m = query.match(pattern);
    if (m) add(code, score, 'institution', m[0]);
  }
  for (const { keywords, code, score } of CONTEXT_KEYWORDS) {
    if (keywords.test(query)) add(code, score, 'context', query.slice(0, 50));
  }
  const cyr = detectCyrillic(query);
  if (cyr) add(cyr.code, cyr.score, 'language', 'Cyrillic');

  return Object.entries(byCode)
    .map(([code, { score, signals }]) => ({ code, score, signals }))
    .sort((a, b) => b.score - a.score);
}

export function getDetectedCodes(query: string, minScore = 50): string[] {
  const classified = classifyJurisdictions(query);
  return [...new Set(classified.filter((c) => c.score >= minScore).map((c) => c.code))];
}
