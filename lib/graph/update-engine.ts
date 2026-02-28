import { prisma } from '@/lib/prisma';

export async function triggerDocumentUpdateChain(
  documentId: string,
  _newVersion: number
) {
  const doc = await prisma.legalDocument.findUnique({
    where: { id: documentId },
    include: { graphNode: true },
  });
  if (!doc?.graphNode) return;
  const templateLinks = await prisma.legalTemplateLink.findMany({
    where: { nodeId: doc.graphNode.id },
    include: { template: true },
  });
  for (const link of templateLinks) {
    const overlays = await prisma.templateOverlay.findMany({
      where: {
        section: { templateId: link.templateId },
      },
      include: { section: true },
    });
    for (const overlay of overlays) {
      await prisma.templateOverlay.update({
        where: { id: overlay.id },
        data: {
          overlayText: (overlay.overlayText ?? '') + ` [Updated by doc ${documentId}]`,
          version: overlay.version + 1,
        },
      });
    }
    const template = await prisma.legalTemplate.findUnique({
      where: { id: link.templateId },
    });
    if (template) {
      await prisma.legalTemplateVersion.create({
        data: {
          templateId: template.id,
          version: template.version + 1,
          changeReason: `Legal document ${documentId} updated`,
        },
      });
      await prisma.legalTemplate.update({
        where: { id: template.id },
        data: { version: template.version + 1 },
      });
    }
  }
  await prisma.updateAudit.create({
    data: {
      module: doc.module,
      action: 'TEMPLATE_UPDATE_CHAIN',
      resourceId: documentId,
      summary: `Triggered template updates for ${templateLinks.length} templates`,
    },
  });
}

export async function onLocalActAdded(
  _documentId: string,
  jurisdictionId: string,
  _module: string
) {
  const overlays = await prisma.templateOverlay.findMany({
    where: { jurisdictionId },
    include: { section: true },
  });
  for (const o of overlays) {
    await prisma.templateOverlay.update({
      where: { id: o.id },
      data: { version: o.version + 1 },
    });
  }
}

export async function onEuOrInternationalChange(documentId: string, module: string) {
  await triggerDocumentUpdateChain(documentId, 0);
}
