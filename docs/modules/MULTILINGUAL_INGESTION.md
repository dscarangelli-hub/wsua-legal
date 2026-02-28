# Multilingual Ingestion Layer

## Purpose

Support language detection, translation to normalized English, preservation of original text, sentence-level alignment, and metadata (translation confidence, jurisdiction tags) for all federated legal modules.

## Supported Languages

Ukrainian, Russian, English, French, German, Dutch, Polish, Spanish, and extendable to all UN/EU languages.

## API (Stubs)

- **`detectLanguage(text)`** — Returns ISO 639-1 code or `"unknown"`. Stub: heuristic (Cyrillic vs Latin). Production: use compactlangdetect or equivalent.
- **`translateToNormalizedEnglish(rawText, sourceLang)`** — Returns normalized English, confidence score, and sentence alignments. Stub: returns input with confidence 0.5 if non-English. Production: MT API + alignment.
- **`runIngestionPipeline(input)`** — Full pipeline: detect language, translate, preserve original, store alignments. Persistence to DB is done by the caller (LegalDocument + DocumentTranslation).

## Data Model

- **LegalDocument** — `rawContent`, `normalizedContent`, `metadata`.
- **DocumentTranslation** — `sourceLanguage`, `targetLanguage`, `originalText`, `translatedText`, `confidence`, `sentenceAlignments` (JSON).

## Integration

Called by federated module ingestion jobs when new documents are ingested. Output is written to `LegalDocument` and `DocumentTranslation`; graph and template updates are triggered separately by the versioning layer.
