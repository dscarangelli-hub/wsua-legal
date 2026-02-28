/**
 * Graph Integration Layer — Template Engine APIs for the NGO/Template module.
 * getTemplate, getTemplateSections, getOverlays, updateOverlay, createTemplateVersion.
 */

import { prisma } from "@/lib/prisma";

export async function getTemplate(templateId: string) {
  const template = await prisma.legalTemplate.findUnique({
    where: { id: templateId },
    include: {
      jurisdiction: { select: { id: true, code: true, name: true } },
      _count: { select: { sections: true, links: true } },
    },
  });
  return template;
}

export async function getTemplateSections(templateId: string) {
  const sections = await prisma.legalTemplateSection.findMany({
    where: { templateId },
    orderBy: { order: "asc" },
    include: {
      templateOverlays: {
        include: { jurisdiction: { select: { id: true, code: true, name: true } } },
      },
    },
  });
  return sections;
}

export async function getOverlays(sectionId: string) {
  const overlays = await prisma.templateOverlay.findMany({
    where: { sectionId },
    include: { jurisdiction: { select: { id: true, code: true, name: true } } },
  });
  return overlays;
}

export async function updateOverlay(
  overlayId: string,
  newText: string
): Promise<{ version: number }> {
  const overlay = await prisma.templateOverlay.findUnique({
    where: { id: overlayId },
    select: { id: true, version: true },
  });
  if (!overlay) throw new Error("Overlay not found");

  const newVersion = overlay.version + 1;
  await prisma.templateOverlay.update({
    where: { id: overlayId },
    data: { overlayText: newText, version: newVersion, updatedAt: new Date() },
  });

  await prisma.graphDelta.create({
    data: {
      entityType: "OVERLAY",
      entityId: overlayId,
      oldVersion: overlay.version,
      newVersion,
      diff: null,
    },
  });
  return { version: newVersion };
}

export async function createTemplateVersion(
  templateId: string,
  params: { changeReason?: string; changeLog?: string; delta?: string }
): Promise<{ version: number }> {
  const template = await prisma.legalTemplate.findUnique({
    where: { id: templateId },
    select: { id: true, version: true },
  });
  if (!template) throw new Error("Template not found");

  const newVersion = template.version + 1;
  await prisma.legalTemplateVersion.create({
    data: {
      templateId,
      version: newVersion,
      changeReason: params.changeReason ?? null,
      changeLog: params.changeLog ?? null,
      delta: params.delta ?? null,
    },
  });
  await prisma.legalTemplate.update({
    where: { id: templateId },
    data: { version: newVersion, updatedAt: new Date() },
  });
  await prisma.graphDelta.create({
    data: {
      entityType: "TEMPLATE",
      entityId: templateId,
      oldVersion: template.version,
      newVersion,
      diff: params.delta ?? null,
    },
  });
  return { version: newVersion };
}
