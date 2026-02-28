import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Detect relevant jurisdictions from a free-text query.
 * Stub: uses keyword matching; production would use NER / classifier.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const query = (body.query as string) ?? "";

  const all = await prisma.jurisdiction.findMany({
    select: { id: true, code: true, name: true, layer: true },
  });

  const q = query.toLowerCase();
  const detected: typeof all = [];

  for (const j of all) {
    if (
      q.includes(j.code.toLowerCase()) ||
      q.includes(j.name.toLowerCase()) ||
      (j.code === "EU" && (q.includes("eu ") || q.includes("european") || q.includes("regulation") || q.includes("directive"))) ||
      (j.code === "UA" && (q.includes("ukraine") || q.includes("ukrainian") || q.includes("kyiv"))) ||
      (j.code === "US" && (q.includes("u.s.") || q.includes("united states") || q.includes("federal") || q.includes("irs"))) ||
      (j.code === "INTERNATIONAL" && (q.includes("un ") || q.includes("treaty") || q.includes("international") || q.includes("unsc")))
    ) {
      detected.push(j);
    }
  }

  // If nothing matched, return top-level jurisdictions so user can pick
  const suggested =
    detected.length > 0
      ? detected
      : all.filter((j) => j.layer === "international" || j.layer === "national").slice(0, 6);

  return NextResponse.json({
    query,
    detectedJurisdictionIds: detected.map((d) => d.id),
    suggestedJurisdictionIds: suggested.map((s) => s.id),
    jurisdictions: all,
  });
}
