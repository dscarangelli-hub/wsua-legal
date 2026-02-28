/**
 * Graph Integration Layer — Query interface for the CRM.
 * Jurisdiction-filtered, cross-jurisdictional, obligation tracing, conflict detection,
 * multilingual search, template recommendations, scenario guidance.
 * Accepts confirmed jurisdictions from the jurisdiction selector.
 */

import { prisma } from "@/lib/prisma";

export interface QueryOptions {
  jurisdictionIds?: string[];
  crossJurisdictional?: boolean;
  limit?: number;
  offset?: number;
}

export async function getLegalDocument(documentId: string) {
  const doc = await prisma.legalDocument.findUnique({
    where: { id: documentId },
    include: {
      jurisdiction: { select: { id: true, code: true, name: true, layer: true } },
      graphNode: { select: { id: true, label: true, nodeType: true } },
      obligations: true,
      versionHistory: { orderBy: { version: "desc" }, take: 5 },
    },
  });
  return doc;
}

export async function getObligationsByJurisdiction(
  jurisdictionIds: string[],
  options: QueryOptions = {}
) {
  const limit = options.limit ?? 50;
  const where =
    jurisdictionIds.length > 0
      ? { jurisdictionId: { in: jurisdictionIds } }
      : {};
  const obligations = await prisma.legalObligation.findMany({
    where,
    include: {
      document: {
        select: {
          id: true,
          title: true,
          documentType: true,
          version: true,
          jurisdiction: { select: { code: true, name: true } },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
    take: limit,
    skip: options.offset ?? 0,
  });
  return obligations;
}

/** Trace obligation flow: obligation → document → edges (requires, interprets, etc.) */
export async function traceObligationFlow(obligationId: string) {
  const obligation = await prisma.legalObligation.findUnique({
    where: { id: obligationId },
    include: {
      document: {
        include: {
          jurisdiction: { select: { id: true, code: true, name: true } },
          graphNode: { select: { id: true } },
        },
      },
    },
  });
  if (!obligation) return null;

  const edgesFrom = await prisma.graphEdge.findMany({
    where: { fromType: "OBLIGATION", fromId: obligationId },
    select: { toType: true, toId: true, edgeType: true, metadata: true },
  });
  const edgesToDoc = await prisma.graphEdge.findMany({
    where: {
      toType: "LEGAL_DOCUMENT",
      toId: obligation.documentId,
    },
    select: { fromType: true, fromId: true, edgeType: true },
  });
  const nodeId = obligation.document.graphNode?.id;
  let nodeEdges: { fromId: string; toId: string; edgeType: string }[] = [];
  if (nodeId) {
    const fromNode = await prisma.legalGraphEdge.findMany({
      where: { fromId: nodeId },
      select: { toId: true, edgeType: true },
    });
    const toNode = await prisma.legalGraphEdge.findMany({
      where: { toId: nodeId },
      select: { fromId: true, edgeType: true },
    });
    nodeEdges = [
      ...fromNode.map((e) => ({ fromId: nodeId, toId: e.toId, edgeType: e.edgeType })),
      ...toNode.map((e) => ({ fromId: e.fromId, toId: nodeId, edgeType: e.edgeType })),
    ];
  }
  return {
    obligation,
    flowsTo: edgesFrom,
    flowsFromDocument: edgesToDoc,
    graphNodeEdges: nodeEdges,
  };
}

export async function getTemplatesForScenario(
  scenarioTag: string,
  jurisdictionIds: string[] = [],
  options: QueryOptions = {}
) {
  const limit = options.limit ?? 20;
  const where: { isActive: boolean; scenarioTags?: { has: string }; jurisdictionId?: { in: string[] } } = {
    isActive: true,
    scenarioTags: { has: scenarioTag },
  };
  if (jurisdictionIds.length > 0) {
    where.jurisdictionId = { in: jurisdictionIds };
  }
  const templates = await prisma.legalTemplate.findMany({
    where,
    include: {
      jurisdiction: { select: { id: true, code: true, name: true } },
      _count: { select: { sections: true } },
    },
    orderBy: { updatedAt: "desc" },
    take: limit,
    skip: options.offset ?? 0,
  });
  return templates;
}

export async function getOverlaysForJurisdiction(
  jurisdictionId: string,
  templateId?: string
) {
  const where: { jurisdictionId: string; section?: { templateId?: string } } = {
    jurisdictionId,
  };
  if (templateId) where.section = { templateId };
  const overlays = await prisma.templateOverlay.findMany({
    where,
    include: {
      section: {
        select: { id: true, key: true, title: true, templateId: true },
      },
      jurisdiction: { select: { code: true, name: true } },
    },
  });
  return overlays;
}

/** Conflict detection: find edges of type overrides/supersedes and return pairs */
export async function detectConflicts(jurisdictionIds: string[] = [], limit = 50) {
  const base = { edgeType: { in: ["overrides", "supersedes"] } };
  const where =
    jurisdictionIds.length > 0
      ? {
          ...base,
          OR: [
            { from: { jurisdictionId: { in: jurisdictionIds } } },
            { to: { jurisdictionId: { in: jurisdictionIds } } },
          ],
        }
      : base;

  const edges = await prisma.legalGraphEdge.findMany({
    where,
    include: {
      from: { select: { id: true, label: true, document: { select: { title: true, documentType: true } } } },
      to: { select: { id: true, label: true, document: { select: { title: true, documentType: true } } } },
    },
    take: limit,
  });
  return edges.map((e) => ({
    edgeType: e.edgeType,
    from: e.from,
    to: e.to,
  }));
}

/** Multilingual search: documents by normalized or original content */
export async function searchLegalDocuments(
  q: string,
  jurisdictionIds: string[] = [],
  options: QueryOptions = {}
) {
  const limit = options.limit ?? 30;
  const where: {
    OR?: Array<{ normalizedContent?: { contains: string; mode: "insensitive" }; rawContent?: { contains: string; mode: "insensitive" }; title?: { contains: string; mode: "insensitive" } }>;
    jurisdictionId?: { in: string[] };
  } = {
    OR: [
      { normalizedContent: { contains: q, mode: "insensitive" } },
      { rawContent: { contains: q, mode: "insensitive" } },
      { title: { contains: q, mode: "insensitive" } },
    ],
  };
  if (jurisdictionIds.length > 0) where.jurisdictionId = { in: jurisdictionIds };
  const docs = await prisma.legalDocument.findMany({
    where,
    include: { jurisdiction: { select: { code: true, name: true } } },
    take: limit,
    skip: options.offset ?? 0,
  });
  return docs;
}

/** Template recommendations for a scenario + jurisdictions (from selector). */
export async function getTemplateRecommendations(
  scenarioTag: string,
  jurisdictionIds: string[]
) {
  return getTemplatesForScenario(scenarioTag, jurisdictionIds, { limit: 10 });
}

/** Scenario guidance retrieval: templates + linked legal nodes for a scenario. */
export async function getScenarioGuidance(
  scenarioId: string,
  jurisdictionIds: string[]
) {
  const templates = await getTemplatesForScenario(scenarioId, jurisdictionIds, { limit: 20 });
  const templateIds = templates.map((t) => t.id);
  const links = await prisma.legalTemplateLink.findMany({
    where: { templateId: { in: templateIds } },
    include: { graphNode: { select: { id: true, label: true, document: { select: { id: true, title: true } } } } },
  });
  const linkedNodeIds = [...new Set(links.map((l) => l.graphNodeId))];
  return {
    scenarioId,
    templates,
    linkedLegalNodeIds: linkedNodeIds,
    links: links.map((l) => ({ templateId: l.templateId, graphNodeId: l.graphNodeId, role: l.role })),
  };
}
