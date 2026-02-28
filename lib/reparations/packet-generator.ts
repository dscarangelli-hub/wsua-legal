import { prisma } from "@/lib/prisma";
import { generateICCULegalFraming } from "./iccu-framing";

export type PacketFormat = "json" | "xml" | "pdf";

export interface ClaimPacketPayload {
  claimId: string;
  title: string;
  narrative: unknown;
  evidenceIndex: Array<{ id: string; type: string; summary?: string }>;
  harmClassification: string;
  timeline: unknown;
  iccuFraming: unknown;
  rd4uMetadata: unknown;
  language: "en" | "uk" | "bilingual";
}

export async function generateClaimPacket(
  claimId: string,
  format: PacketFormat,
  language: "en" | "uk" | "bilingual",
  jurisdictionIds: string[]
): Promise<{ packetId: string; format: string; contentRef?: string; contentJson?: string }> {
  const claim = await prisma.claim.findUnique({
    where: { id: claimId },
    include: { rd4uCategory: true, evidence: { select: { id: true, type: true, metadata: true } } },
  });
  if (!claim) throw new Error("Claim not found");

  const iccu = await generateICCULegalFraming(claimId, jurisdictionIds);
  const payload: ClaimPacketPayload = {
    claimId: claim.id,
    title: claim.title,
    narrative: claim.narrative,
    evidenceIndex: claim.evidence.map((e) => ({ id: e.id, type: e.type, summary: (e.metadata as { summary?: string })?.summary })),
    harmClassification: claim.rd4uCategory?.title ?? "",
    timeline: claim.timeline,
    iccuFraming: iccu,
    rd4uMetadata: claim.rd4uMetadata,
    language,
  };

  const langTag = language === "bilingual" ? "en_uk" : language;
  const version = (await prisma.claimPacket.count({ where: { claimId } })) + 1;

  if (format === "json") {
    const contentJson = JSON.stringify(payload, null, 2);
    const packet = await prisma.claimPacket.create({
      data: { claimId, version, format: "json", contentJson, language: langTag },
    });
    return { packetId: packet.id, format: "json", contentJson };
  }
  if (format === "xml") {
    const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<claimPacket>\n  <claimId>${esc(payload.claimId)}</claimId>\n  <title>${esc(payload.title)}</title>\n  <harmClassification>${esc(payload.harmClassification)}</harmClassification>\n</claimPacket>`;
    const packet = await prisma.claimPacket.create({
      data: { claimId, version, format: "xml", contentJson: xml, language: langTag },
    });
    return { packetId: packet.id, format: "xml", contentJson: xml };
  }
  const contentRef = `pdf/${claimId}/v${version}.pdf`;
  const packet = await prisma.claimPacket.create({
    data: { claimId, version, format: "pdf", contentRef, language: langTag },
  });
  return { packetId: packet.id, format: "pdf", contentRef };
}
