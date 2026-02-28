import { splitSentences } from './translation';
import type { SentenceAlignment } from './types';

export function buildOneToOneAlignment(
  sourceText: string,
  targetText: string
): SentenceAlignment[] {
  const sourceSentences = splitSentences(sourceText);
  const targetSentences = splitSentences(targetText);
  const len = Math.min(sourceSentences.length, targetSentences.length);
  const result: SentenceAlignment[] = [];
  for (let i = 0; i < len; i++) {
    result.push({
      sourceIndex: i,
      targetIndex: i,
      sourceText: sourceSentences[i],
      targetText: targetSentences[i],
    });
  }
  return result;
}
