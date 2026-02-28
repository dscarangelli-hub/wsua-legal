export type SupportedLanguage =
  | 'uk' | 'ru' | 'en' | 'fr' | 'de' | 'nl' | 'pl' | 'es'
  | 'ar' | 'zh' | 'it' | 'pt' | 'ja' | 'el' | 'bg' | 'hr' | 'cs' | 'da' | 'et' | 'fi' | 'hu' | 'ga' | 'lv' | 'lt' | 'mt' | 'ro' | 'sk' | 'sl' | 'sv';

export type DocumentType =
  | 'treaty' | 'statute' | 'regulation' | 'directive' | 'decision' | 'case' | 'resolution'
  | 'order' | 'administrative_order' | 'oblast_act' | 'city_act'
  | 'humanitarian_standard' | 'sanctions_list' | 'donor_template';

export interface RawDocument {
  content: string;
  title?: string;
  sourceUrl?: string;
  jurisdictionCode?: string;
  legalLevel?: string;
  documentType?: string;
  authority?: string;
  dates?: { adopted?: string; effective?: string };
  celexId?: string;
  radaId?: string;
  unSymbol?: string;
  cfrCitation?: string;
  externalId?: string;
  sourceLanguage?: string;
  sourceMetadata?: SourceMetadata;
}

export interface SourceMetadata {
  module?: string;
  jurisdictionCode?: string;
  legalLevel?: string;
  documentType?: string;
  sourceUrl?: string;
  externalId?: string;
}

export interface SentenceAlignment {
  sourceIndex: number;
  targetIndex: number;
  sourceText: string;
  targetText: string;
}

export interface IngestedDocumentOutput {
  document_id: string;
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
}

export interface IngestResult {
  success: boolean;
  output?: IngestedDocumentOutput;
  document_id?: string;
  errors: string[];
  warnings: string[];
}
