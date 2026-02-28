/**
 * Sentence-level alignment — mapping between original and translated sentences.
 */

import type { SentenceAlignmentItem } from "./types";
import { splitSentences } from "./translation";

/**
 * Build alignment when source and target have same sentence count (1:1).
 */
export function buildOneToOneAlignment(
  sourceText: string,
  targetText: string
): SentenceAlignmentItem[] {
  const sourceSents = splitSentences(sourceText);
  const targetSents = splitSentences(targetText);
  const len = Math.min(sourceSents.length, targetSents.length);
  const alignments: SentenceAlignmentItem[] = [];
  for (let i = 0; i < len; i++) {
    alignments.push({
      sourceIdx: i,
      targetIdx: i,
      sourceSpan: sourceSents[i],
      targetSpan: targetSents[i],
      confidence: 1,
    });
  }
  return alignments;
}

/**
 * Merge alignments from translation module with any existing; dedupe by (sourceIdx, targetIdx).
 */
export function mergeAlignments(
  existing: SentenceAlignmentItem[],
  fromTranslation: SentenceAlignmentItem[]
): SentenceAlignmentItem[] {
  const key = (a: SentenceAlignmentItem) => `${a.sourceIdx}:${a.targetIdx}`;
  const seen = new Set(existing.map(key));
  const out = [...existing];
  for (const a of fromTranslation) {
    if (!seen.has(key(a))) {
      seen.add(key(a));
      out.push(a);
    }
  }
  return out.sort((a, b) => a.sourceIdx - b.sourceIdx || a.targetIdx - b.targetIdx);
}
