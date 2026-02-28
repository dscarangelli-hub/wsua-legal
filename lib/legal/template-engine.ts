/**
 * NGO / Nonprofit Operational Module — template object model and update engine stubs
 */

import { prisma } from "@/lib/prisma";

export interface TemplateOverlayUpdate {
  templateId: string;
  sectionKey: string;
  jurisdictionCode: string;
  newContent: string;
  changeReason: string;
}

/**
 * Automatic Template Update Engine stub.
 * When a linked law changes: update overlays, annotations, required/optional sections,
 * increment version, store delta, preserve previous version.
 */
export async function applyTemplateUpdate(params: {
  templateId: string;
  changeReason: string;
  overlayUpdates?: TemplateOverlayUpdate[];
  requiredSectionKeys?: string[];
}): Promise<{ version: number; previousVersion: number }> {
  const template = await prisma.legalTemplate.findUnique({
    where: { id: params.templateId },
    select: { id: true, version: true },
  });
  if (!template) throw new Error("Template not found");

  const previousVersion = template.version;
  const newVersion = previousVersion + 1;

  if (params.overlayUpdates?.length) {
    for (const up of params.overlayUpdates) {
      const section = await prisma.legalTemplateSection.findFirst({
        where: { templateId: params.templateId, key: up.sectionKey },
      });
      if (section?.overlays && typeof section.overlays === "object") {
        const overlays = section.overlays as Record<string, string>;
        overlays[up.jurisdictionCode] = up.newContent;
        await prisma.legalTemplateSection.update({
          where: { id: section.id },
          data: { overlays, updatedAt: new Date() },
        });
      }
    }
  }

  if (params.requiredSectionKeys?.length) {
    const sections = await prisma.legalTemplateSection.findMany({
      where: { templateId: params.templateId },
    });
    for (const s of sections) {
      await prisma.legalTemplateSection.update({
        where: { id: s.id },
        data: {
          isRequired: params.requiredSectionKeys!.includes(s.key),
          updatedAt: new Date(),
        },
      });
    }
  }

  await prisma.legalTemplateVersion.create({
    data: {
      templateId: params.templateId,
      version: newVersion,
      changeReason: params.changeReason,
      delta: null,
    },
  });

  await prisma.legalTemplate.update({
    where: { id: params.templateId },
    data: { version: newVersion, updatedAt: new Date() },
  });

  return { version: newVersion, previousVersion };
}

/**
 * Scenario guidance stub — returns structured scenario metadata.
 * Legally neutral; no binding advice.
 */
export const SCENARIO_GUIDANCE_IDS = [
  "humanitarian",
  "cross_border",
  "sanctions",
  "data_protection",
  "ngo_registration",
  "procurement",
  "volunteer",
  "partnership",
  "fiscal_sponsorship",
  "grant_compliance",
  "monitoring_eval",
] as const;

export async function getScenarioGuidance(
  scenarioId: string,
  _jurisdictionIds: string[]
): Promise<{
  scenarioId: string;
  label: string;
  description: string;
  templateIds: string[];
  linkedLegalNodeIds: string[];
}> {
  const templates = await prisma.legalTemplate.findMany({
    where: { isActive: true, scenarioTags: { has: scenarioId } },
    take: 20,
    select: { id: true },
  });
  return {
    scenarioId,
    label: scenarioId.replace(/_/g, " "),
    description: "Structured guidance for this scenario. Use template library and linked legal nodes. Non-advisory.",
    templateIds: templates.map((t) => t.id),
    linkedLegalNodeIds: [],
  };
}
