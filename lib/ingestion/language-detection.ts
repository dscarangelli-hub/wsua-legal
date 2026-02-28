/**
 * Language detection — statistical and rule-based methods.
 */

import type { SupportedLanguage } from "./types";

const ISO_639_1 = ["uk", "ru", "en", "fr", "de", "nl", "pl", "es", "ar", "zh", "it", "pt", "ja", "el", "bg", "hr", "cs", "da", "et", "fi", "hu", "ga", "lv", "lt", "mt", "ro", "sk", "sl", "sv"] as const;

const CYRILLIC = /[\u0400-\u04FF]/;
const UKRAINIAN_SPECIFIC = /[\u0404\u0406\u0407\u0456\u0457\u0490\u0491]/;
const GREEK = /[\u0370-\u03FF]/;
const ARABIC = /[\u0600-\u06FF]/;
const CJK = /[\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF]/;

const LANGUAGE_MARKERS: Record<string, string[]> = {
  en: ["the", "and", "of", "to", "in", "for", "is", "on", "with", "as", "by", "article", "section", "shall", "may"],
  uk: ["та", "на", "в", "з", "для", "за", "що", "як", "стаття", "закон", "україни", "рішення", "постанова"],
  ru: ["и", "в", "на", "с", "по", "для", "что", "как", "статья", "закон", "решение", "постановление"],
  de: ["der", "die", "und", "in", "den", "von", "zu", "das", "für", "auf", "Artikel", "Absatz"],
  fr: ["le", "la", "les", "et", "des", "du", "en", "une", "article", "loi", "décret"],
  es: ["el", "la", "los", "las", "y", "en", "de", "que", "artículo", "ley", "decreto"],
  pl: ["i", "w", "na", "z", "do", "nie", "art", "ustawa", "rozporządzenie"],
  nl: ["de", "het", "een", "van", "in", "en", "is", "artikel", "wet"],
  it: ["il", "la", "di", "per", "che", "in", "articolo", "legge", "decreto"],
  pt: ["o", "a", "os", "as", "e", "em", "de", "que", "artigo", "lei"],
};

function countMarkerHits(text: string, markers: string[]): number {
  const lower = text.toLowerCase();
  return markers.filter((m) => lower.includes(m)).length;
}

export function detectLanguage(text: string): { language: SupportedLanguage | "unknown"; confidence: number } {
  const trimmed = (text || "").trim();
  if (trimmed.length < 15) return { language: "unknown", confidence: 0 };

  const sample = trimmed.slice(0, 5000);
  let best: { lang: SupportedLanguage | "unknown"; score: number } = { lang: "unknown", score: 0 };

  if (CYRILLIC.test(sample)) {
    const ukScore = UKRAINIAN_SPECIFIC.test(sample) ? 0.9 : 0.3;
    const ruScore = UKRAINIAN_SPECIFIC.test(sample) ? 0.2 : 0.85;
    if (ukScore >= ruScore) best = { lang: "uk", score: ukScore + countMarkerHits(sample, LANGUAGE_MARKERS.uk) * 0.05 };
    if (ruScore > best.score) best = { lang: "ru", score: ruScore + countMarkerHits(sample, LANGUAGE_MARKERS.ru) * 0.05 };
  }
  if (GREEK.test(sample)) {
    const score = 0.7 + countMarkerHits(sample, ["και", "την", "του", "άρθρο"]) * 0.05;
    if (score > best.score) best = { lang: "el", score };
  }
  if (ARABIC.test(sample) && 0.8 > best.score) best = { lang: "ar", score: 0.8 };
  if (CJK.test(sample) && 0.75 > best.score) best = { lang: "zh", score: 0.75 };

  if (best.lang === "unknown" || best.score < 0.5) {
    for (const [lang, markers] of Object.entries(LANGUAGE_MARKERS)) {
      if (lang === "uk" || lang === "ru") continue;
      const hits = countMarkerHits(sample, markers);
      const score = Math.min(0.3 + hits * 0.1, 0.95);
      if (score > best.score && ISO_639_1.includes(lang as SupportedLanguage)) best = { lang: lang as SupportedLanguage, score };
    }
  }

  if (best.lang === "unknown" && /^[\w\s.,;:!'"\-()[\]\d\u00C0-\u024F]+$/.test(sample)) best = { lang: "en", score: 0.5 };

  return { language: best.score >= 0.25 ? best.lang : "unknown", confidence: Math.min(best.score, 1) };
}

export function isSupportedLanguage(code: string): code is SupportedLanguage {
  return ISO_639_1.includes(code as SupportedLanguage);
}
