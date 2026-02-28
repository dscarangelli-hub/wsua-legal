import { prisma } from '@/lib/prisma';
import { generateICCULegalFraming } from './iccu-framing';

export type PacketFormat = 'pdf' | 'json' | 'xml';
export type Locale = 'en' | 'uk';

export interface ClaimPacketPayload {
  claimId: string;
  title: string;
  narrative: string;
  harmClassification: string | null;
  timeline: unknown;
  evidenceIndex: Array<{ id: string; type: string; storagePath?: string }>;
  iccuFraming: unknown;
  rd4uMetadata: unknown;
  version: number;
  locale: Locale;
}

export async function generateClaimPacketPayload(
  claimId: string,
  locale: Locale = 'en'
): Promise<ClaimPacketPayload> {
  const claim = await prisma.claim.findUnique({
    where: { id: claimId },
    include: { evidence: true, category: true },
  });
  if (!claim) throw new Error('Claim not found');
  const iccuFraming = await generateICCULegalFraming(claimId);
  const evidenceIndex = claim.evidence.map((e) => ({
    id: e.id,
    type: e.type,
    storagePath: e.storagePath ?? undefined,
  }));
  return {
    claimId: claim.id,
    title: claim.title,
    narrative: claim.narrative ?? '',
    harmClassification: claim.harmClassification,
    timeline: claim.timelineJson,
    evidenceIndex,
    iccuFraming: iccuFraming.structuredFraming,
    rd4uMetadata: claim.rd4uMetadata,
    version: claim.version,
    locale,
  };
}

export async function createClaimPacketRecord(
  claimId: string,
  format: PacketFormat,
  storagePath: string | null,
  locale: Locale
) {
  const claim = await prisma.claim.findUnique({ where: { id: claimId } });
  if (!claim) throw new Error('Claim not found');
  return prisma.claimPacket.create({
    data: {
      claimId,
      format,
      storagePath,
      locale,
      version: claim.version,
    },
  });
}
