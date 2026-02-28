/**
 * Ingestion pipeline — ingestDocument, normalizeDocument, translateDocument,
 * extractMetadata, prepareForGraph. Validation and error handling.
 * Does not write to the graph; returns normalized object to the calling module.
 */

import { randomUUID } from "crypto";
import type { RawDocument, SourceMetadata, IngestedDocumentOutput, IngestResult, IngestedDocumentOutput as Output } from "./types";
import { detectLanguage, isSupportedLanguage } from "./language-detection";
import { translateToNormalizedEnglish } from "./translation";
import { extractMetadata } from "./metadata-extraction";
import { normalizeDocumentText } from "./normalization";
import { buildOneToOneAlignment, mergeAlignments } from "./sentence-alignment";

const DEFAULT_VERSION = 1;
const MIN_CONTENT_LENGTH = 10;
const MIN_TRANSLATION_CONFIDENCE = 0.2;

export function normalizeDocument(raw: RawDocument): { content: string; title: string } {
  const content = normalizeDocumentText(raw.content ?? "");
  const title = (raw.title ?? "").trim() || "Untitled";
  return { content, title };
}

export async function translateDocument(
  content: string,
  sourceLanguage: string
): Promise<{ normalizedEnglish: string; confidence: number; alignments: Output["sentence_alignment"] }> {
  const result = await translateToNormalizedEnglish(content, sourceLanguage);
  return {
    normalizedEnglish: result.normalizedEnglish,
    confidence: result.confidence,
    alignments: result.alignments,
  };
}

export function extractMetadataFromDocument(
  raw: RawDocument,
  sourceMetadata?: SourceMetadata | null,
  translationConfidence?: number
) {
  return extractMetadata(raw, sourceMetadata, translationConfidence ?? 0);
}

/**
 * Prepare the ingested document for insertion into the graph.
 * Returns the output schema; caller (legal module) writes to graph via Graph Integration Layer.
 */
export function prepareForGraph(
  params: {
    document_id: string;
    title: string;
    jurisdiction: string;
    legal_level: string;
    document_type: string;
    authority: string;
    original_language: string;
    original_text: string;
    normalized_text: string;
    sentence_alignment: Output["sentence_alignment"];
    metadata: Output["metadata"];
    version_number: number;
    source_url: string;
  }
): IngestedDocumentOutput {
  return { ...params };
}

function validateDocument(raw: RawDocument): string[] {
  const errors: string[] = [];
  if (!raw?.content || typeof raw.content !== "string") errors.push("Missing or invalid content");
  else if (raw.content.trim().length < MIN_CONTENT_LENGTH) errors.push("Content too short");
  return errors;
}

function validateTranslation(confidence: number): string[] {
  const errors: string[] = [];
  if (confidence < MIN_TRANSLATION_CONFIDENCE) errors.push("Translation confidence too low");
  return errors;
}

function validateMetadata(meta: { jurisdiction: string; documentType: string }): string[] {
  const errors: string[] = [];
  if (!meta.jurisdiction || meta.jurisdiction === "UNKNOWN") errors.push("Jurisdiction missing or unknown");
  return errors;
}

/**
 * Full pipeline: ingest raw document + source metadata, return normalized output or errors.
 * Does not write to the graph. Caller must use prepareForGraph output with Graph Integration Layer.
 */
export async function ingestDocument(
  rawDocument: RawDocument,
  sourceMetadata?: SourceMetadata | null,
  options?: { generateId?: boolean }
): Promise<IngestResult> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const generateId = options?.generateId !== false;

  const validationErrors = validateDocument(rawDocument);
  if (validationErrors.length) {
    return { success: false, errors: validationErrors, warnings: [] };
  }

  const docId = generateId ? randomUUID() : (rawDocument.externalId ?? randomUUID());

  const { content: normalizedContent, title } = normalizeDocument(rawDocument);
  const originalText = (rawDocument.content ?? "").trim();

  const { language: detectedLang, confidence: detectConfidence } = detectLanguage(originalText);
  const sourceLanguage = rawDocument.sourceLanguage ?? (isSupportedLanguage(detectedLang) ? detectedLang : "en");

  const { normalizedEnglish, confidence: translationConfidence, alignments } = await translateDocument(
    normalizedContent,
    sourceLanguage
  );

  const translationErrors = validateTranslation(translationConfidence);
  if (translationErrors.length) warnings.push(...translationErrors);

  const metadata = extractMetadata(rawDocument, sourceMetadata ?? null, translationConfidence);
  const metaErrors = validateMetadata(metadata);
  if (metaErrors.length) errors.push(...metaErrors);

  const sentence_alignment = alignments.length
    ? mergeAlignments([], alignments)
    : buildOneToOneAlignment(originalText, normalizedEnglish);

  const output: IngestedDocumentOutput = prepareForGraph({
    document_id: docId,
    title: title || "Untitled",
    jurisdiction: metadata.jurisdiction,
    legal_level: metadata.legalLevel,
    document_type: metadata.documentType,
    authority: metadata.authority ?? "",
    original_language: sourceLanguage,
    original_text: originalText,
    normalized_text: normalizedEnglish,
    sentence_alignment,
    metadata: { ...metadata } as Output["metadata"],
    version_number: DEFAULT_VERSION,
    source_url: metadata.sourceUrl ?? "",
  });

  const success = errors.length === 0;
  return {
    success,
    output: success ? output : undefined,
    document_id: docId,
    errors,
    warnings,
  };
}
