/**
 * Graph Integration Layer — node and edge types, entity type constants.
 */

export const ENTITY_TYPES = [
  "LEGAL_DOCUMENT",
  "GRAPH_NODE",
  "OBLIGATION",
  "TEMPLATE",
  "TEMPLATE_SECTION",
  "OVERLAY",
] as const;
export type GraphEntityType = (typeof ENTITY_TYPES)[number];

export const GRAPH_EDGE_TYPES = [
  "implements",   // Directive → National Statute
  "transposes",   // EU → Member State
  "amends",       // Statute → Statute
  "overrides",    // National → Local
  "interprets",   // Case → Statute
  "cites",        // Document → Document
  "supersedes",   // New Version → Old Version
  "requires",     // Obligation → TemplateSection
  "informs",      // LegalDocument → Overlay
  "updates",      // LegalDocument → Template
] as const;
export type GraphEdgeType = (typeof GRAPH_EDGE_TYPES)[number];

export interface LegalDocumentInput {
  title: string;
  documentType: string;
  jurisdictionId: string;
  legalLevel?: string;
  authority?: string;
  module: string;
  sourceUrl?: string;
  dateAdopted?: string | Date;
  effectiveFrom?: string | Date;
  effectiveTo?: string | Date;
  originalLanguage?: string;
  originalText?: string;
  normalizedText?: string;
  metadata?: Record<string, unknown>;
  externalId?: string;
}

export interface ObligationInput {
  documentId: string;
  text: string;
  scope?: string;
  jurisdictionId?: string;
  legalBasis?: string;
}

export interface AddRelationshipInput {
  sourceType: GraphEntityType;
  sourceId: string;
  targetType: GraphEntityType;
  targetId: string;
  relationshipType: GraphEdgeType;
  metadata?: Record<string, unknown>;
}

export interface DocumentVersionUpdate {
  documentId: string;
  normalizedText?: string;
  contentDelta?: string;
  changeSummary?: string;
}
