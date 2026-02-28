# Multilingual Ingestion and Normalization Layer

Processes incoming legal documents: language detection, translation to normalized English, preserve original, sentence alignment, metadata. Does not write to the graph; returns normalized output for the calling module to pass to the Graph Integration Layer.

## APIs

- **ingestDocument(raw_document, source_metadata?, options?)** — Full pipeline; returns IngestResult.
- **normalizeDocument(raw)** — Content + title.
- **translateDocument(content, sourceLanguage)** — Translation + alignments.
- **extractMetadata(raw, sourceMetadata?, translationConfidence)** — Metadata.
- **prepareForGraph(params)** — Output for graph.

## Output schema

document_id, title, jurisdiction, legal_level, document_type, authority, original_language, original_text, normalized_text, sentence_alignment, metadata, version_number, source_url.

## Endpoint

POST /api/ingestion — body: raw_document, source_metadata?, generate_id?.

## Files

src/lib/ingestion/types.ts, language-detection.ts, translation.ts, metadata-extraction.ts, normalization.ts, sentence-alignment.ts, pipeline.ts, version-diff.ts, index.ts. src/app/api/ingestion/route.ts.
