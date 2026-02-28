import { prisma } from "@/lib/prisma";

export interface ICCUFramingOutput {
  violations: Array<{ norm: string; description: string; source?: string }>;
  harmToNorms: Array<{ harm: string; normIds: string[] }>;
  legalFraming: { summary: string; references: string[] };
  ukrainianLawRefs: string[];
  euLawRefs: string[];
}

export async function generateICCULegalFraming(claimId: string, jurisdictionIds: string[]): Promise<ICCUFramingOutput> {
  const claim = await prisma.claim.findUnique({
    where: { id: claimId },
    include: { rd4uCategory: true },
  });
  if (!claim) throw new Error("Claim not found");

  const violations: ICCUFramingOutput["violations"] = [
    { norm: "IHL – Geneva Conventions", description: "Relevant to harm classification", source: "international" },
    { norm: "Human rights – ECHR", description: "Applicable where jurisdiction applies", source: "international" },
    { norm: "Aggression – UN GA Resolution", description: "Context for state responsibility", source: "international" },
  ];
  const harmToNorms: ICCUFramingOutput["harmToNorms"] = [
    { harm: claim.rd4uCategory?.title ?? "Claim harm", normIds: ["ihl", "echr"] },
  ];

  const docRefs = await prisma.legalDocument.findMany({
    where: { jurisdictionId: { in: jurisdictionIds } },
    take: 10,
    select: { id: true, title: true, jurisdiction: { select: { code: true } } },
  });
  const ukrainianLawRefs = docRefs.filter((d) => ["UA", "UA_OBLAST", "UA_CITY"].includes(d.jurisdiction?.code ?? "")).map((d) => d.title);
  const euLawRefs = docRefs.filter((d) => d.jurisdiction?.code === "EU").map((d) => d.title);

  return {
    violations,
    harmToNorms,
    legalFraming: { summary: "Structured legal framing for RD4U/ICCU. Not legal advice.", references: docRefs.map((d) => d.title) },
    ukrainianLawRefs,
    euLawRefs,
  };
}
