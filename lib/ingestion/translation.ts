import type { SupportedLanguage } from './types';

export function translateToNormalizedEnglish(
  sourceText: string,
  sourceLanguage: string
): {
  translatedText: string;
  confidence: number;
  alignments: Array<{ sourceIndex: number; targetIndex: number }>;
} {
  if (sourceLanguage === 'en' || sourceLanguage === 'en-US' || sourceLanguage === 'en-GB') {
    const sentences = splitSentences(sourceText);
    return {
      translatedText: sourceText,
      confidence: 1,
      alignments: sentences.map((_, i) => ({ sourceIndex: i, targetIndex: i })),
    };
  }
  return {
    translatedText: sourceText,
    confidence: 0.5,
    alignments: [],
  };
}

export function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}
