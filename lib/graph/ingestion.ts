/**
 * Graph Integration Layer — APIs for legal modules to write into the graph.
 * addLegalDocument, addObligation, addRelationship, updateDocumentVersion.
 */

import { prisma } from "@/lib/prisma";
import { recordAudit } from "@/lib/legal/versioning";
import type { LegalDocumentInput, ObligationInput, AddRelationshipInput, DocumentVersionUpdate } from "./types";
import type { LegalModule } from "@/lib/legal/types";
import { triggerDocumentUpdateChain } from "./update-engine";

const DOCUMENT_TYPE = "LEGAL_DOCUMENT";
const GRAPH_NODE = "GRAPH_NODE";
const OBLIGATION = "OBLIGATION";
const TEMPLATE = "TEMPLATE";
const TEMPLATE_SECTION = "TEMPLATE_SECTION";
const OVERLAY = "OVERLAY";

export async function addLegalDocument(
  input: LegalDocumentInput,
  module: LegalModule
): Promise<{ documentId: string; graphNodeId?: string }> {
  const doc = await prisma.legalDocument.create({
    data: {
      title: input.title,
      documentType: input.documentType,
      jurisdictionId: input.jurisdictionId,
      legalLevel: input.legalLevel ?? null,
      authority: input.authority ?? null,
      module,
      sourceUrl: input.sourceUrl ?? null,
      dateAdopted: input.dateAdopted ? new Date(input.dateAdopted) : null,
      effectiveFrom: input.effectiveFrom ? new Date(input.effectiveFrom) : null,
      effectiveTo: input.effectiveTo ? new Date(input.effectiveTo) : null,
      originalLanguage: input.originalLanguage ?? null,
      rawContent: input.originalText ?? null,
      normalizedContent: input.normalizedText ?? null,
      metadata: input.metadata ?? undefined,
      externalId: input.externalId ?? null,
      version: 1,
    },
  });

  const jurisdiction = await prisma.jurisdiction.findUnique({
    where: { id: doc.jurisdictionId },
    select: { id: true },
  });
  const graphNode = await prisma.legalGraphNode.create({
    data: {
      documentId: doc.id,
      label: doc.title.slice(0, 200),
      nodeType: doc.documentType,
      jurisdictionId: jurisdiction?.id ?? null,
      metadata: {},
    },
  });

  await recordAudit({
    module,
    action: "ingest",
    resourceId: doc.id,
    summary: `Added legal document: ${doc.title}`,
    metadata: { documentType: doc.documentType },
  });

  return { documentId: doc.id, graphNodeId: graphNode.id };
}

export async function addObligation(input: ObligationInput): Promise<{ obligationId: string }> {
  const ob = await prisma.legalObligation.create({
    data: {
      documentId: input.documentId,
      text: input.text,
      scope: input.scope ?? null,
      jurisdictionId: input.jurisdictionId ?? null,
      legalBasis: input.legalBasis ?? null,
      version: 1,
    },
  });
  return { obligationId: ob.id };
}

export async function addRelationship(
  input: AddRelationshipInput,
  metadata?: { module?: LegalModule }
): Promise<{ edgeId: string }> {
  const edge = await prisma.graphEdge.create({
    data: {
      fromType: input.sourceType,
      fromId: input.sourceId,
      toType: input.targetType,
      toId: input.targetId,
      edgeType: input.relationshipType,
      metadata: input.metadata ?? undefined,
      version: 1,
    },
  });
  if (metadata?.module) {
    await recordAudit({
      module: metadata.module,
      action: "graph_update",
      resourceId: edge.id,
      summary: `Edge: ${input.sourceType}:${input.sourceId} --[${input.relationshipType}]--> ${input.targetType}:${input.targetId}`,
    });
  }
  return { edgeId: edge.id };
}

export async function updateDocumentVersion(
  input: DocumentVersionUpdate,
  module: LegalModule
): Promise<{ newVersion: number }> {
  const doc = await prisma.legalDocument.findUnique({
    where: { id: input.documentId },
    select: { id: true, version: true },
  });
  if (!doc) throw new Error("Document not found");

  const newVersion = doc.version + 1;
  await prisma.legalDocumentVersion.create({
    data: {
      documentId: doc.id,
      version: newVersion,
      contentDelta: input.contentDelta ?? null,
      changeSummary: input.changeSummary ?? null,
    },
  });
  await prisma.legalDocument.update({
    where: { id: doc.id },
    data: {
      version: newVersion,
      normalizedContent: input.normalizedText ?? undefined,
      updatedAt: new Date(),
    },
  });

  await prisma.graphDelta.create({
    data: {
      entityType: "LEGAL_DOCUMENT",
      entityId: doc.id,
      oldVersion: doc.version,
      newVersion,
      diff: input.contentDelta ?? null,
    },
  });

  await recordAudit({
    module,
    action: "graph_update",
    resourceId: doc.id,
    summary: `Document version ${doc.version} → ${newVersion}`,
  });

  await triggerDocumentUpdateChain(doc.id, newVersion);

  return { newVersion };
}
