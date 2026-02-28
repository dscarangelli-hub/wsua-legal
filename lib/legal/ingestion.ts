/**
 * Multilingual Ingestion Layer — types and stubs
 * Production: wire to language-detection and MT services (e.g. sentence-level alignment).
 */

import type { SupportedLanguage } from "./types";

export interface IngestInput {
  rawText: string;
  sourceLanguage?: string; // if unknown, will be detected
  documentId: string;
  jurisdictionCode: string;
  module: string;
  metadata?: Record<string, unknown>;
}

export interface IngestResult {
  documentId: string;
  detectedLanguage: string;
  normalizedEnglish: string;
  originalPreserved: string;
  translationConfidence: number;
  sentenceAlignments: Array<{
    sourceIdx: number;
    targetIdx: number;
    sourceSpan: string;
    targetSpan: string;
  }>;
  errors?: string[];
}

/**
 * Stub: language detection. Replace with compactlangdetect or similar.
 */
export function detectLanguage(text: string): SupportedLanguage | "unknown" {
  if (!text || text.length < 10) return "unknown";
  // Heuristic stub: check for Cyrillic vs Latin
  const cyrillic = /[\u0400-\u04FF]/.test(text);
  const ukSpecific = /[\u0404\u0406\u0407\u0456\u0457]/.test(text);
  if (cyrillic) return ukSpecific ? "uk" : "ru";
  return "en";
}

/**
 * Stub: translate to normalized English. Replace with MT API + sentence alignment.
 */
export async function translateToNormalizedEnglish(
  rawText: string,
  sourceLang: string
): Promise<{
  normalizedEnglish: string;
  confidence: number;
  alignments: IngestResult["sentenceAlignments"];
}> {
  // Placeholder: return as-is if already English, else echo with low confidence
  const isEnglish = sourceLang === "en" || /^[a-zA-Z\s.,;:!'"-]+$/.test(rawText.slice(0, 200));
  return {
    normalizedEnglish: isEnglish ? rawText : rawText,
    confidence: isEnglish ? 1 : 0.5,
    alignments: [],
  };
}

/**
 * Stub: full ingestion pipeline for one document.
 */
export async function runIngestionPipeline(input: IngestInput): Promise<IngestResult> {
  const detectedLanguage = input.sourceLanguage ?? detectLanguage(input.rawText);
  const lang = detectedLanguage === "unknown" ? "en" : detectedLanguage;
  const { normalizedEnglish, confidence, alignments } = await translateToNormalizedEnglish(
    input.rawText,
    lang
  );
  return {
    documentId: input.documentId,
    detectedLanguage: lang,
    normalizedEnglish,
    originalPreserved: input.rawText,
    translationConfidence: confidence,
    sentenceAlignments: alignments,
  };
}
