import { prisma } from '@/lib/prisma';

export type LegalModule = 'INTERNATIONAL' | 'EU' | 'UKRAINE' | 'US';

export interface AddLegalDocumentInput {
  title: string;
  documentType: string;
  jurisdictionId?: string;
  module: LegalModule;
  rawContent?: string;
  normalizedContent?: string;
  legalLevel?: string;
  authority?: string;
  dateAdopted?: Date;
  dateEffective?: Date;
  originalLanguage?: string;
  sourceUrl?: string;
  externalId?: string;
}

export async function addLegalDocument(
  document: AddLegalDocumentInput,
  _module: LegalModule
) {
  const doc = await prisma.legalDocument.create({
    data: {
      title: document.title,
      documentType: document.documentType,
      jurisdictionId: document.jurisdictionId ?? null,
      module: document.module,
      rawContent: document.rawContent ?? null,
      normalizedContent: document.normalizedContent ?? null,
      legalLevel: document.legalLevel ?? null,
      authority: document.authority ?? null,
      dateAdopted: document.dateAdopted ?? null,
      dateEffective: document.dateEffective ?? null,
      originalLanguage: document.originalLanguage ?? null,
      sourceUrl: document.sourceUrl ?? null,
      externalId: document.externalId ?? null,
    },
  });
  const node = await prisma.legalGraphNode.create({
    data: {
      documentId: doc.id,
      jurisdictionId: doc.jurisdictionId,
      label: doc.title,
      nodeType: 'DOCUMENT',
    },
  });
  await prisma.updateAudit.create({
    data: {
      module: document.module,
      action: 'CREATE_DOCUMENT',
      resourceId: doc.id,
      summary: `Created document ${doc.title}`,
    },
  });
  return { document: doc, node };
}

export interface AddObligationInput {
  documentId: string;
  text: string;
  scope?: string;
  jurisdictionId?: string;
  legalBasis?: string;
}

export async function addObligation(input: AddObligationInput) {
  return prisma.legalObligation.create({
    data: {
      documentId: input.documentId,
      text: input.text,
      scope: input.scope ?? null,
      jurisdictionId: input.jurisdictionId ?? null,
      legalBasis: input.legalBasis ?? null,
    },
  });
}

const EDGE_TYPES = [
  'implements',
  'transposes',
  'amends',
  'overrides',
  'interprets',
  'cites',
  'supersedes',
  'requires',
  'informs',
  'updates',
] as const;

export async function addRelationship(
  input: {
    sourceType: string;
    sourceId: string;
    targetType: string;
    targetId: string;
    relationshipType: string;
    metadata?: Record<string, unknown>;
  },
  _metadata?: Record<string, unknown>
) {
  if (!EDGE_TYPES.includes(input.relationshipType as (typeof EDGE_TYPES)[number])) {
    throw new Error('Invalid edge type');
  }
  return prisma.graphEdge.create({
    data: {
      fromType: input.sourceType,
      fromId: input.sourceId,
      toType: input.targetType,
      toId: input.targetId,
      edgeType: input.relationshipType,
      metadata: (input.metadata ?? _metadata) as object | null,
    },
  });
}

export async function updateDocumentVersion(
  documentId: string,
  input: {
    normalizedText?: string;
    contentDelta?: string;
    changeSummary?: string;
  },
  module: LegalModule
) {
  const doc = await prisma.legalDocument.findUnique({
    where: { id: documentId },
    include: { obligations: true },
  });
  if (!doc) throw new Error('Document not found');
  const newVersion = doc.version + 1;
  await prisma.legalDocumentVersion.create({
    data: {
      documentId,
      version: newVersion,
      contentDelta: input.contentDelta ?? null,
      changeSummary: input.changeSummary ?? null,
    },
  });
  await prisma.legalDocument.update({
    where: { id: documentId },
    data: {
      version: newVersion,
      normalizedContent: input.normalizedText ?? doc.normalizedContent,
    },
  });
  await prisma.graphDelta.create({
    data: {
      entityType: 'LegalDocument',
      entityId: documentId,
      oldVersion: doc.version,
      newVersion,
      diff: input as object,
    },
  });
  const { triggerDocumentUpdateChain } = await import('./update-engine');
  await triggerDocumentUpdateChain(documentId, newVersion);
  await prisma.updateAudit.create({
    data: {
      module,
      action: 'UPDATE_VERSION',
      resourceId: documentId,
      summary: input.changeSummary ?? `Version ${newVersion}`,
    },
  });
  return { version: newVersion };
}
