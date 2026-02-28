export const SUPPORTED_LANGUAGES = ["uk","ru","en","fr","de","nl","pl","es","ar","zh","it","pt","ja","el","bg","hr","cs","da","et","fi","hu","ga","lv","lt","mt","ro","sk","sl","sv"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const DOCUMENT_TYPES = ["treaty","statute","regulation","directive","decision","case","resolution","order","administrative_order","oblast_act","city_act","humanitarian_standard","sanctions_list","donor_template"] as const;
export type DocumentType = (typeof DOCUMENT_TYPES)[number];

export const LEGAL_LEVELS = ["international","regional","national","subnational"] as const;
export type LegalLevel = (typeof LEGAL_LEVELS)[number];

export interface RawDocument {
  content: string;
  title?: string;
  sourceUrl?: string;
  jurisdictionCode?: string;
  legalLevel?: string;
  documentType?: string;
  authority?: string;
  dateAdopted?: string;
  dateEffective?: string;
  dateEffectiveTo?: string;
  celexId?: string;
  radaId?: string;
  unSymbol?: string;
  cfrCitation?: string;
  externalId?: string;
  sourceLanguage?: string;
  sourceMetadata?: Record<string, unknown>;
}

export interface SourceMetadata {
  module: "INTERNATIONAL" | "EU" | "UKRAINE" | "US";
  jurisdictionCode: string;
  legalLevel?: LegalLevel;
  documentType?: DocumentType;
  sourceUrl?: string;
  externalId?: string;
  [key: string]: unknown;
}

export interface SentenceAlignmentItem {
  sourceIdx: number;
  targetIdx: number;
  sourceSpan: string;
  targetSpan: string;
  confidence?: number;
}

export interface ExtractedMetadata {
  jurisdiction: string;
  legalLevel: string;
  documentType: string;
  authority: string | null;
  dateAdopted: string | null;
  dateEffective: string | null;
  dateEffectiveTo: string | null;
  sourceUrl: string | null;
  translationConfidence: number;
  languageCode: string;
  documentIdentifiers: Record<string, string>;
  [key: string]: unknown;
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
  sentence_alignment: SentenceAlignmentItem[];
  metadata: ExtractedMetadata & Record<string, unknown>;
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
