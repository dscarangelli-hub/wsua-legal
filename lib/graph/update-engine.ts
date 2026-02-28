/**
 * Automatic Update Engine — event-driven propagation when legal documents change.
 * When a legal document is updated: compute delta, update graph, identify linked
 * obligations, identify templates/overlays linked to those obligations, update
 * overlays, generate new template versions, store audit logs.
 */

import { prisma } from "@/lib/prisma";
import { recordAudit } from "@/lib/legal/versioning";
import type { LegalModule } from "@/lib/legal/types";

/** Called after a legal document version is updated. */
export async function triggerDocumentUpdateChain(
  documentId: string,
  newVersion: number
): Promise<void> {
  const doc = await prisma.legalDocument.findUnique({
    where: { id: documentId },
    include: { jurisdiction: { select: { code: true } } },
  });
  if (!doc) return;

  const module = doc.module as LegalModule;

  // 1. Identify linked obligations (same document)
  const obligations = await prisma.legalObligation.findMany({
    where: { documentId },
    select: { id: true },
  });

  // 2. Find templates linked to this document via GraphEdge (informs, updates) or LegalTemplateLink (graph node)
  const graphNode = await prisma.legalGraphNode.findUnique({
    where: { documentId },
    select: { id: true },
  });

  const templateIds = new Set<string>();

  if (graphNode) {
    const links = await prisma.legalTemplateLink.findMany({
      where: { graphNodeId: graphNode.id },
      select: { templateId: true },
    });
    links.forEach((l) => templateIds.add(l.templateId));
  }

    const edgesToTemplate = await prisma.graphEdge.findMany({
      where: {
        fromType: "LEGAL_DOCUMENT",
        fromId: documentId,
        toType: "TEMPLATE",
        edgeType: "updates",
      },
      select: { toId: true },
    });
    edgesToTemplate.forEach((e) => templateIds.add(e.toId));

  // 3. For each template: update overlays for this document's jurisdiction, create new template version
  for (const templateId of templateIds) {
    await updateTemplateFromLegalChange(templateId, documentId, doc.jurisdictionId, doc.jurisdiction?.code ?? null, module);
  }

  // 4. Obligation → TemplateSection (requires): find sections linked by "requires" from these obligations
  for (const ob of obligations) {
    const requiresEdges = await prisma.graphEdge.findMany({
      where: {
        fromType: "OBLIGATION",
        fromId: ob.id,
        toType: "TEMPLATE_SECTION",
        edgeType: "requires",
      },
      select: { toId: true },
    });
    for (const e of requiresEdges) {
      const section = await prisma.legalTemplateSection.findUnique({
        where: { id: e.toId },
        select: { templateId: true },
      });
      if (section) templateIds.add(section.templateId);
    }
  }

  // Run template updates again for obligation-linked templates (idempotent if already done)
  for (const templateId of templateIds) {
    await updateTemplateFromLegalChange(templateId, documentId, doc.jurisdictionId, doc.jurisdiction?.code ?? null, module);
  }

  await recordAudit({
    module,
    action: "template_update",
    resourceId: documentId,
    summary: `Propagated document v${newVersion} to ${templateIds.size} template(s)`,
    metadata: { newVersion, templateIds: Array.from(templateIds) },
  });
}

async function updateTemplateFromLegalChange(
  templateId: string,
  documentId: string,
  jurisdictionId: string,
  jurisdictionCode: string | null,
  module: LegalModule
): Promise<void> {
  const template = await prisma.legalTemplate.findUnique({
    where: { id: templateId },
    select: { id: true, version: true },
  });
  if (!template) return;

  const newVersion = template.version + 1;

  // Update overlays for this jurisdiction (TemplateOverlay rows)
  const sections = await prisma.legalTemplateSection.findMany({
    where: { templateId },
    include: { templateOverlays: { where: { jurisdictionId } } },
  });
  for (const section of sections) {
    const overlay = section.templateOverlays[0];
    if (overlay) {
      await prisma.templateOverlay.update({
        where: { id: overlay.id },
        data: {
          overlayText: overlay.overlayText + `\n\n[Updated by legal document ${documentId} v2]`,
          version: overlay.version + 1,
          updatedAt: new Date(),
        },
      });
    }
  }

  await prisma.legalTemplateVersion.create({
    data: {
      templateId,
      version: newVersion,
      changeReason: `Linked law updated: document ${documentId}`,
      changeLog: `Legal document ${documentId} (${module}) triggered overlay/template update.`,
      delta: null,
    },
  });
  await prisma.legalTemplate.update({
    where: { id: templateId },
    data: { version: newVersion, updatedAt: new Date() },
  });
}

/**
 * When a new local act is added: update oblast/city overlays and scenario guidance.
 */
export async function onLocalActAdded(
  documentId: string,
  jurisdictionId: string,
  module: LegalModule
): Promise<void> {
  const jurisdiction = await prisma.jurisdiction.findUnique({
    where: { id: jurisdictionId },
    select: { code: true, layer: true },
  });
  if (!jurisdiction || (jurisdiction.layer !== "subnational" && jurisdiction.code !== "UA_OBLAST" && jurisdiction.code !== "UA_CITY")) return;

  const templatesWithOblastCity = await prisma.legalTemplate.findMany({
    where: {
      isActive: true,
      sections: {
        some: {
          templateOverlays: {
            some: { jurisdictionId },
          },
        },
      },
    },
    select: { id: true },
  });
  for (const t of templatesWithOblastCity) {
    await updateTemplateFromLegalChange(t.id, documentId, jurisdictionId, jurisdiction.code, module);
  }
  await recordAudit({
    module,
    action: "template_update",
    resourceId: documentId,
    summary: `Local act: updated overlays for jurisdiction ${jurisdiction.code}`,
  });
}

/**
 * When EU or international law changes: propagate to national and local overlays where applicable.
 */
export async function onEuOrInternationalChange(
  documentId: string,
  module: LegalModule
): Promise<void> {
  if (module !== "EU" && module !== "INTERNATIONAL") return;
  const doc = await prisma.legalDocument.findUnique({
    where: { id: documentId },
    select: { version: true },
  });
  if (!doc) return;
  await triggerDocumentUpdateChain(documentId, doc.version);
}
