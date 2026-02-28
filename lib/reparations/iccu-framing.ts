import { prisma } from '@/lib/prisma';

export interface ICCUFramingInput {
  claimId: string;
  violations?: string[];
  norms?: string[];
  ukrainianLawLinks?: string[];
  euLawLinks?: string[];
}

export interface ICCUFramingOutput {
  claimId: string;
  internationalLawViolations: string[];
  norms: string[];
  ukrainianLawLinks: string[];
  euLawLinks: string[];
  structuredFraming: Record<string, unknown>;
}

export async function generateICCULegalFraming(claimId: string): Promise<ICCUFramingOutput> {
  const claim = await prisma.claim.findUnique({
    where: { id: claimId },
    include: { evidence: true },
  });
  if (!claim) throw new Error('Claim not found');
  const existing = (claim.iccuFramingJson as Record<string, unknown> | null) ?? {};
  const violations = (existing.internationalLawViolations as string[]) ?? [];
  const norms = (existing.norms as string[]) ?? ['IHL', 'human rights', 'aggression'];
  const ukrainianLawLinks = (existing.ukrainianLawLinks as string[]) ?? [];
  const euLawLinks = (existing.euLawLinks as string[]) ?? [];
  return {
    claimId,
    internationalLawViolations: violations,
    norms,
    ukrainianLawLinks,
    euLawLinks,
    structuredFraming: {
      claimId,
      harmClassification: claim.harmClassification,
      narrative: claim.narrative,
      internationalLawViolations: violations,
      norms,
      ukrainianLawLinks,
      euLawLinks,
    },
  };
}

export async function saveICCUFraming(claimId: string, framing: ICCUFramingOutput) {
  await prisma.claim.update({
    where: { id: claimId },
    data: {
      iccuFramingJson: {
        internationalLawViolations: framing.internationalLawViolations,
        norms: framing.norms,
        ukrainianLawLinks: framing.ukrainianLawLinks,
        euLawLinks: framing.euLawLinks,
        structuredFraming: framing.structuredFraming,
      },
    },
  });
  return framing;
}
