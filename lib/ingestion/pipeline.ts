import { v4 as uuid } from 'uuid';
import type { RawDocument, IngestedDocumentOutput, IngestResult, SentenceAlignment } from './types';
import { detectLanguage } from './language-detection';
import { translateToNormalizedEnglish } from './translation';
import { extractMetadata } from './metadata-extraction';
import { normalizeDocumentText } from './normalization';
import { buildOneToOneAlignment } from './sentence-alignment';

export function normalizeDocument(raw: RawDocument): { content: string; title: string } {
  const content = normalizeDocumentText(raw.content ?? '');
  const title = (raw.title ?? '').trim() || 'Untitled';
  return { content, title };
}

export function translateDocument(
  content: string,
  sourceLanguage: string
): { translatedText: string; confidence: number; alignments: SentenceAlignment[] } {
  const { translatedText, confidence, alignments } = translateToNormalizedEnglish(
    content,
    sourceLanguage
  );
  const sourceSentences = content.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
  const targetSentences = translatedText.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
  const sentence_alignment: SentenceAlignment[] =
    alignments.length > 0
      ? alignments.map((a) => ({
          sourceIndex: a.sourceIndex,
          targetIndex: a.targetIndex,
          sourceText: sourceSentences[a.sourceIndex] ?? '',
          targetText: targetSentences[a.targetIndex] ?? '',
        }))
      : buildOneToOneAlignment(content, translatedText);
  return { translatedText, confidence, alignments: sentence_alignment };
}

export function extractMetadataFromDocument(
  raw: RawDocument,
  sourceMetadata?: RawDocument['sourceMetadata'],
  translationConfidence?: number
): Record<string, unknown> {
  return extractMetadata(raw, sourceMetadata, translationConfidence);
}

export function prepareForGraph(params: {
  documentId: string;
  title: string;
  jurisdiction: string;
  legal_level: string;
  document_type: string;
  authority: string;
  original_language: string;
  original_text: string;
  normalized_text: string;
  sentence_alignment: SentenceAlignment[];
  metadata: Record<string, unknown>;
  version_number: number;
  source_url: string;
}): IngestedDocumentOutput {
  return {
    document_id: params.documentId,
    title: params.title,
    jurisdiction: params.jurisdiction,
    legal_level: params.legal_level,
    document_type: params.document_type,
    authority: params.authority,
    original_language: params.original_language,
    original_text: params.original_text,
    normalized_text: params.normalized_text,
    sentence_alignment: params.sentence_alignment,
    metadata: params.metadata,
    version_number: params.version_number,
    source_url: params.source_url,
  };
}

export function ingestDocument(
  rawDocument: RawDocument,
  sourceMetadata?: RawDocument['sourceMetadata'],
  options?: { generate_id?: boolean }
): IngestResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const docId = options?.generate_id !== false ? uuid() : '';

  if (!rawDocument.content || rawDocument.content.trim().length < 5) {
    return {
      success: false,
      errors: ['Content is required and must be at least 5 characters'],
      warnings: [],
    };
  }

  const { content, title } = normalizeDocument(rawDocument);
  const { language, confidence } = detectLanguage(content);
  const { translatedText, confidence: transConfidence, alignments } = translateDocument(
    content,
    rawDocument.sourceLanguage ?? language
  );
  const finalConfidence = transConfidence * confidence;
  if (finalConfidence < 0.3) warnings.push('Low translation confidence');

  const metadata = extractMetadataFromDocument(
    { ...rawDocument, content, title },
    sourceMetadata,
    finalConfidence
  ) as Record<string, unknown>;
  const jurisdiction = String(metadata.jurisdiction ?? 'UNKNOWN');
  if (jurisdiction === 'UNKNOWN') warnings.push('Jurisdiction could not be determined');

  const output = prepareForGraph({
    document_id: docId,
    title,
    jurisdiction,
    legal_level: String(metadata.legalLevel ?? 'national'),
    document_type: String(metadata.documentType ?? 'statute'),
    authority: String(metadata.authority ?? ''),
    original_language: language,
    original_text: content,
    normalized_text: translatedText,
    sentence_alignment: alignments,
    metadata,
    version_number: 1,
    source_url: String(metadata.sourceUrl ?? rawDocument.sourceUrl ?? ''),
  });

  return {
    success: true,
    output,
    document_id: docId,
    errors,
    warnings,
  };
}
