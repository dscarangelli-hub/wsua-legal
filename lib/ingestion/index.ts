/**
 * Multilingual Ingestion Layer — public API.
 * Legal modules call ingestDocument; use prepareForGraph output with Graph Integration Layer.
 */

export {
  ingestDocument,
  normalizeDocument,
  translateDocument,
  extractMetadataFromDocument,
  prepareForGraph,
} from "./pipeline";

export { detectLanguage, isSupportedLanguage } from "./language-detection";
export { translateToNormalizedEnglish, splitSentences } from "./translation";
export { extractMetadata } from "./metadata-extraction";
export { normalizeDocumentText } from "./normalization";
export { buildOneToOneAlignment, mergeAlignments } from "./sentence-alignment";
export { diffVersions, emitUpdateEvent } from "./version-diff";

export type {
  RawDocument,
  SourceMetadata,
  IngestedDocumentOutput,
  IngestResult,
  SentenceAlignmentItem,
  ExtractedMetadata,
  DocumentType,
  LegalLevel,
  SupportedLanguage,
} from "./types";

export type { TranslationResult } from "./translation";
export type { DocumentVersionDiff, IngestionUpdateEvent } from "./version-diff";
