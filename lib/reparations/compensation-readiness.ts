import { prisma } from "@/lib/prisma";

export type ClaimStatus = "draft" | "submitted" | "under_review" | "eligible" | "payment_ready" | "closed";
export type PaymentReadiness = "not_ready" | "ready" | "submitted";

export interface CompensationReadinessSummary {
  claimId: string;
  status: ClaimStatus;
  eligibilityMetadata: unknown;
  paymentReadiness: PaymentReadiness | null;
  canSubmit: boolean;
  nextSteps: string[];
}

export async function getCompensationReadiness(claimId: string): Promise<CompensationReadinessSummary> {
  const claim = await prisma.claim.findUnique({
    where: { id: claimId },
    include: { evidence: { select: { id: true } } },
  });
  if (!claim) throw new Error("Claim not found");
  const status = claim.status as ClaimStatus;
  const paymentReadiness = claim.paymentReadiness as PaymentReadiness | null;
  const canSubmit = status === "draft" && (claim.evidence?.length ?? 0) > 0 && claim.narrative != null;
  const nextSteps: string[] = [];
  if (status === "draft") {
    if (!claim.narrative) nextSteps.push("Complete claim narrative");
    if ((claim.evidence?.length ?? 0) === 0) nextSteps.push("Upload at least one evidence item");
    if (nextSteps.length === 0) nextSteps.push("Submit claim for review");
  } else if (status === "submitted" || status === "under_review") nextSteps.push("Await eligibility determination");
  else if (status === "eligible") nextSteps.push("Confirm payment readiness when applicable");

  return {
    claimId: claim.id,
    status,
    eligibilityMetadata: claim.eligibilityMetadata,
    paymentReadiness,
    canSubmit,
    nextSteps,
  };
}

export async function updateClaimStatus(claimId: string, status: ClaimStatus, eligibilityMetadata?: unknown) {
  return prisma.claim.update({
    where: { id: claimId },
    data: { status, eligibilityMetadata: eligibilityMetadata ?? undefined, updatedAt: new Date() },
  });
}

export async function setPaymentReadiness(claimId: string, readiness: PaymentReadiness) {
  return prisma.claim.update({
    where: { id: claimId },
    data: { paymentReadiness: readiness, updatedAt: new Date() },
  });
}
