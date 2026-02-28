import { prisma } from '@/lib/prisma';

export async function getLegalDocument(documentId: string) {
  return prisma.legalDocument.findUnique({
    where: { id: documentId },
    include: { jurisdiction: true, obligations: true },
  });
}

export async function getObligationsByJurisdiction(
  jurisdictionIds: string[],
  options: { limit?: number; offset?: number } = {}
) {
  const { limit = 50, offset = 0 } = options;
  const where =
    jurisdictionIds.length > 0
      ? { jurisdictionId: { in: jurisdictionIds } }
      : {};
  return prisma.legalObligation.findMany({
    where,
    take: limit,
    skip: offset,
    include: { document: true, jurisdiction: true },
  });
}

export async function traceObligationFlow(obligationId: string) {
  const obligation = await prisma.legalObligation.findUnique({
    where: { id: obligationId },
    include: { document: true },
  });
  if (!obligation) return null;
  const edges = await prisma.graphEdge.findMany({
    where: {
      OR: [
        { fromId: obligation.documentId, fromType: 'LegalDocument' },
        { toId: obligation.documentId, toType: 'LegalDocument' },
      ],
    },
  });
  return { obligation, edges };
}

export async function getTemplatesForScenario(
  scenarioTag: string,
  jurisdictionIds: string[] = [],
  options: { limit?: number } = {}
) {
  const { limit = 20 } = options;
  const where: { scenarioTags?: { has: string }; jurisdictionId?: { in: string[] } } = {
    scenarioTags: { has: scenarioTag },
  };
  if (jurisdictionIds.length) where.jurisdictionId = { in: jurisdictionIds };
  return prisma.legalTemplate.findMany({
    where,
    take: limit,
    include: { sections: true },
  });
}

export async function getOverlaysForJurisdiction(
  jurisdictionId: string,
  templateId?: string
) {
  const where: { jurisdictionId: string; section?: { templateId: string } } = {
    jurisdictionId,
  };
  if (templateId) where.section = { templateId };
  return prisma.templateOverlay.findMany({
    where,
    include: { section: true },
  });
}

export async function detectConflicts(
  jurisdictionIds: string[],
  limit = 10
) {
  const edges = await prisma.graphEdge.findMany({
    where: { edgeType: 'overrides' },
    take: limit,
  });
  return edges;
}

export async function searchLegalDocuments(
  q: string,
  jurisdictionIds: string[] = [],
  options: { limit?: number } = {}
) {
  const { limit = 20 } = options;
  const where: { title?: { contains: string; mode: 'insensitive' }; jurisdictionId?: { in: string[] } } = {
    title: { contains: q, mode: 'insensitive' },
  };
  if (jurisdictionIds.length) where.jurisdictionId = { in: jurisdictionIds };
  return prisma.legalDocument.findMany({
    where,
    take: limit,
    include: { jurisdiction: true },
  });
}

export async function getTemplateRecommendations(
  scenarioTag: string,
  jurisdictionIds: string[] = []
) {
  return getTemplatesForScenario(scenarioTag, jurisdictionIds, { limit: 10 });
}

export async function getScenarioGuidance(
  scenarioId: string,
  jurisdictionIds: string[] = []
) {
  const templates = await getTemplatesForScenario(scenarioId, jurisdictionIds);
  return {
    scenario: scenarioId,
    jurisdictionIds,
    templates: templates.map((t) => ({ id: t.id, name: t.name })),
    guidance: [],
  };
}
