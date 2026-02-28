import { prisma } from "@/lib/prisma";

export type EvidenceType = "photo" | "video" | "document" | "testimony" | "metadata";

export interface EvidenceInput {
  claimId: string;
  type: EvidenceType;
  fileUrl?: string;
  mimeType?: string;
  extractedTimestamp?: string | Date;
  geolocation?: { lat?: number; lng?: number; place?: string };
  rd4uCategoryId?: string;
  harmNarrativeRef?: string;
  metadata?: Record<string, unknown>;
}

function parseDate(v: string | Date | undefined): Date | null {
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

export async function ingestEvidence(input: EvidenceInput): Promise<{ id: string }> {
  const custody = [{ at: new Date().toISOString(), actor: "system", action: "ingested" }];
  const evidence = await prisma.evidenceItem.create({
    data: {
      claimId: input.claimId,
      type: input.type,
      fileUrl: input.fileUrl ?? null,
      mimeType: input.mimeType ?? null,
      extractedTimestamp: parseDate(input.extractedTimestamp) ?? undefined,
      geolocation: input.geolocation ?? undefined,
      rd4uCategoryId: input.rd4uCategoryId ?? null,
      harmNarrativeRef: input.harmNarrativeRef ?? null,
      chainOfCustody: custody,
      metadata: input.metadata ?? undefined,
    },
  });
  return { id: evidence.id };
}

export function extractEvidenceMetadata(raw: Record<string, unknown>) {
  const timestamp = raw.timestamp ?? raw.date ?? raw.created;
  const geo = raw.geolocation ?? raw.location ?? raw.place;
  return {
    timestamp: timestamp ? new Date(String(timestamp)) : undefined,
    geolocation: geo && typeof geo === "object" ? geo as { lat?: number; lng?: number; place?: string } : undefined,
  };
}

export async function classifyEvidenceByRd4uCategory(suggestedCategoryId?: string) {
  if (suggestedCategoryId) {
    const c = await prisma.rd4uCategory.findUnique({ where: { id: suggestedCategoryId } });
    return c ? c.id : null;
  }
  const first = await prisma.rd4uCategory.findFirst({ select: { id: true } });
  return first?.id ?? null;
}
