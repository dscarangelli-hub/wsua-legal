import { prisma } from '@/lib/prisma';

export type EvidenceType = 'photo' | 'video' | 'document' | 'testimony' | 'metadata';

export interface EvidenceInput {
  claimId?: string;
  type: EvidenceType;
  storagePath?: string;
  timestamps?: Record<string, unknown>;
  geolocation?: { lat?: number; lng?: number };
  rd4uCategoryId?: string;
  harmNarrative?: string;
  chainOfCustody?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export async function createEvidence(input: EvidenceInput) {
  return prisma.evidence.create({
    data: {
      claimId: input.claimId ?? null,
      type: input.type,
      storagePath: input.storagePath ?? null,
      timestamps: (input.timestamps ?? null) as object | null,
      geolocation: (input.geolocation ?? null) as object | null,
      rd4uCategoryId: input.rd4uCategoryId ?? null,
      harmNarrative: input.harmNarrative ?? null,
      chainOfCustody: (input.chainOfCustody ?? null) as object | null,
      metadata: (input.metadata ?? null) as object | null,
    },
  });
}

export async function linkEvidenceToClaim(evidenceId: string, claimId: string) {
  return prisma.evidence.update({
    where: { id: evidenceId },
    data: { claimId },
  });
}

export async function getEvidenceByClaim(claimId: string) {
  return prisma.evidence.findMany({
    where: { claimId },
  });
}
