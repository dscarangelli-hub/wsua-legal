/**
 * Translation module — produce normalized English for internal reasoning and graph storage.
 * Preserves original; can be wired to external MT API with sentence-level alignment.
 */

import type { SentenceAlignmentItem } from "./types";

export interface TranslationResult {
  normalizedEnglish: string;
  confidence: number;
  alignments: SentenceAlignmentItem[];
}

/**
 * Translate content to normalized English.
 * Stub: if source is already English, return as-is with confidence 1; otherwise
 * return original with lower confidence (production: call MT API and align sentences).
 */
export async function translateToNormalizedEnglish(
  sourceText: string,
  sourceLanguage: string
): Promise<TranslationResult> {
  const isEnglish =
    sourceLanguage === "en" ||
    /^[\w\s.,;:!'"\-()[\]\d\u00C0-\u024F]+$/.test(sourceText.slice(0, 500));

  if (isEnglish) {
    return {
      normalizedEnglish: sourceText,
      confidence: 1,
      alignments: buildIdentityAlignments(sourceText),
    };
  }

  // Placeholder: no external MT; return original with low confidence and empty alignments
  return {
    normalizedEnglish: sourceText,
    confidence: 0.4,
    alignments: [],
  };
}

/**
 * Build 1:1 sentence alignment when no translation is performed.
 */
function buildIdentityAlignments(text: string): SentenceAlignmentItem[] {
  const sentences = splitSentences(text);
  return sentences.map((span, i) => ({
    sourceIdx: i,
    targetIdx: i,
    sourceSpan: span,
    targetSpan: span,
    confidence: 1,
  }));
}

/**
 * Split text into sentences (for alignment and normalization).
 */
export function splitSentences(text: string): string[] {
  if (!text.trim()) return [];
  const normalized = text.replace(/\r\n/g, "\n").trim();
  const parts = normalized.split(/(?<=[.!?])\s+/);
  return parts.map((p) => p.trim()).filter(Boolean);
}
