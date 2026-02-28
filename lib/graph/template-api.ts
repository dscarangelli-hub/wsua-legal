import { prisma } from '@/lib/prisma';

export async function getTemplate(templateId: string) {
  return prisma.legalTemplate.findUnique({
    where: { id: templateId },
    include: { sections: true },
  });
}

export async function getTemplateSections(templateId: string) {
  return prisma.legalTemplateSection.findMany({
    where: { templateId },
    orderBy: { order: 'asc' },
    include: { overlaysList: true },
  });
}

export async function getOverlays(sectionId: string) {
  return prisma.templateOverlay.findMany({
    where: { sectionId },
    include: { jurisdiction: true },
  });
}

export async function updateOverlay(overlayId: string, newText: string) {
  const overlay = await prisma.templateOverlay.findUnique({
    where: { id: overlayId },
  });
  if (!overlay) throw new Error('Overlay not found');
  const updated = await prisma.templateOverlay.update({
    where: { id: overlayId },
    data: {
      overlayText: newText,
      version: overlay.version + 1,
    },
  });
  await prisma.graphDelta.create({
    data: {
      entityType: 'TemplateOverlay',
      entityId: overlayId,
      oldVersion: overlay.version,
      newVersion: updated.version,
      diff: { overlayText: newText },
    },
  });
  return updated;
}

export async function createTemplateVersion(
  templateId: string,
  params: { changeReason?: string; changeLog?: string; delta?: Record<string, unknown> }
) {
  const template = await prisma.legalTemplate.findUnique({
    where: { id: templateId },
  });
  if (!template) throw new Error('Template not found');
  const newVersion = template.version + 1;
  await prisma.legalTemplateVersion.create({
    data: {
      templateId,
      version: newVersion,
      changeReason: params.changeReason ?? null,
      delta: (params.delta ?? null) as object | null,
    },
  });
  await prisma.legalTemplate.update({
    where: { id: templateId },
    data: { version: newVersion },
  });
  await prisma.graphDelta.create({
    data: {
      entityType: 'LegalTemplate',
      entityId: templateId,
      oldVersion: template.version,
      newVersion,
      diff: params.delta as object | null,
    },
  });
  return { version: newVersion };
}
