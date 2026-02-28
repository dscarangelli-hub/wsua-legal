import { prisma } from "@/lib/prisma";

export interface Rd4uCategoryInput {
  categoryId: string;
  title: string;
  description?: string;
  eligibilityCriteria?: Record<string, unknown>;
  requiredEvidence?: unknown[];
  narrativeStructure?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export async function listRd4uCategories() {
  return prisma.rd4uCategory.findMany({ orderBy: [{ version: "desc" }, { categoryId: "asc" }] });
}

export async function getRd4uCategoryById(id: string) {
  return prisma.rd4uCategory.findUnique({ where: { id } });
}

export async function getRd4uCategoryByCode(categoryId: string) {
  return prisma.rd4uCategory.findUnique({ where: { categoryId } });
}

export async function createRd4uCategory(input: Rd4uCategoryInput) {
  return prisma.rd4uCategory.create({
    data: {
      categoryId: input.categoryId,
      title: input.title,
      description: input.description ?? null,
      eligibilityCriteria: input.eligibilityCriteria ?? undefined,
      requiredEvidence: input.requiredEvidence ?? undefined,
      narrativeStructure: input.narrativeStructure ?? undefined,
      metadata: input.metadata ?? undefined,
      version: 1,
    },
  });
}

export async function updateRd4uCategory(id: string, input: Partial<Omit<Rd4uCategoryInput, "categoryId">>) {
  const existing = await prisma.rd4uCategory.findUnique({ where: { id } });
  if (!existing) throw new Error("RD4U category not found");
  return prisma.rd4uCategory.update({
    where: { id },
    data: {
      title: input.title ?? existing.title,
      description: input.description ?? existing.description,
      eligibilityCriteria: (input.eligibilityCriteria ?? existing.eligibilityCriteria) as object | undefined,
      requiredEvidence: (input.requiredEvidence ?? existing.requiredEvidence) as unknown[] | undefined,
      narrativeStructure: (input.narrativeStructure ?? existing.narrativeStructure) as object | undefined,
      metadata: (input.metadata ?? existing.metadata) as object | undefined,
      version: existing.version + 1,
      updatedAt: new Date(),
    },
  });
}
