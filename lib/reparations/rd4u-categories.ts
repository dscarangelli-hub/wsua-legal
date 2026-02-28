import { prisma } from '@/lib/prisma';

export interface Rd4uCategoryInput {
  categoryId: string;
  title: string;
  description?: string;
  eligibilityCriteria?: string;
  requiredEvidence?: string[];
  narrativeStructure?: string;
  metadata?: Record<string, unknown>;
}

export async function getRd4uCategories() {
  return prisma.rd4uCategory.findMany({
    orderBy: { categoryId: 'asc' },
  });
}

export async function getRd4uCategoryByCategoryId(categoryId: string) {
  return prisma.rd4uCategory.findUnique({
    where: { categoryId },
  });
}

export async function upsertRd4uCategory(input: Rd4uCategoryInput) {
  const existing = await prisma.rd4uCategory.findUnique({
    where: { categoryId: input.categoryId },
  });
  const versionNumber = (existing?.versionNumber ?? 0) + 1;
  const data = {
    title: input.title,
    description: input.description ?? null,
    eligibilityCriteria: input.eligibilityCriteria ?? null,
    requiredEvidence: input.requiredEvidence ?? [],
    narrativeStructure: input.narrativeStructure ?? null,
    metadata: (input.metadata ?? null) as object | null,
    versionNumber,
  };
  if (existing) {
    return prisma.rd4uCategory.update({
      where: { categoryId: input.categoryId },
      data,
    });
  }
  return prisma.rd4uCategory.create({
    data: {
      categoryId: input.categoryId,
      ...data,
    },
  });
}
