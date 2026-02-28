import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Research Assistant — summaries, obligation extraction, compliance mapping, etc.
 * Non-advisory: no drafting of binding legal documents; no legal advice.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const {
    query,
    jurisdictionIds = [],
    scenarioTag,
    mode = "summary",
  } = body as {
    query: string;
    jurisdictionIds?: string[];
    scenarioTag?: string;
    mode?: "summary" | "obligations" | "compliance" | "comparison" | "conflict" | "templates" | "scenario";
  };

  if (!query || typeof query !== "string") {
    return Response.json(
      { error: "Missing or invalid query" },
      { status: 400 }
    );
  }

  // Stub responses per mode
  const disclaimer =
    "This output is for research and orientation only. It does not constitute legal advice or draft binding documents.";

  switch (mode) {
    case "summary": {
      const docs =
        jurisdictionIds.length > 0
          ? await prisma.legalDocument.findMany({
              where: { jurisdictionId: { in: jurisdictionIds } },
              take: 5,
              select: { id: true, title: true, documentType: true, module: true },
            })
          : [];
      return Response.json({
        mode: "summary",
        query,
        disclaimer,
        summary: "Summary placeholder. In production, connect to your summarization pipeline over the selected jurisdictions and graph.",
        relevantDocuments: docs,
      });
    }
    case "obligations": {
      return Response.json({
        mode: "obligations",
        query,
        disclaimer,
        obligations: [],
        message: "Obligation extraction will be wired to the unified graph and document store.",
      });
    }
    case "compliance": {
      return Response.json({
        mode: "compliance",
        query,
        disclaimer,
        complianceMap: [],
        message: "Compliance mapping will use graph edges (implements, depends_on) and template links.",
      });
    }
    case "comparison": {
      return Response.json({
        mode: "comparison",
        query,
        disclaimer,
        jurisdictions: jurisdictionIds,
        comparison: [],
        message: "Cross-jurisdictional comparison will run over normalized content and graph.",
      });
    }
    case "conflict": {
      return Response.json({
        mode: "conflict",
        query,
        disclaimer,
        conflicts: [],
        message: "Conflict detection will use overrides/supersedes and authority hierarchy.",
      });
    }
    case "templates": {
      const templates = await prisma.legalTemplate.findMany({
        where: {
          isActive: true,
          ...(scenarioTag ? { scenarioTags: { has: scenarioTag } } : {}),
          ...(jurisdictionIds.length > 0 ? { jurisdictionId: { in: jurisdictionIds } } : {}),
        },
        take: 10,
        select: { id: true, name: true, source: true, scenarioTags: true },
      });
      return Response.json({
        mode: "templates",
        query,
        disclaimer,
        templateRecommendations: templates,
      });
    }
    case "scenario": {
      return Response.json({
        mode: "scenario",
        query,
        scenarioTag: scenarioTag ?? null,
        disclaimer,
        guidance: "Structured scenario guidance (humanitarian, sanctions, data protection, etc.) will be driven by template scenario tags and linked legal nodes. Legally neutral and non-advisory.",
      });
    }
    default:
      return Response.json({
        mode,
        query,
        disclaimer,
        message: "Unknown research mode. Use summary, obligations, compliance, comparison, conflict, templates, or scenario.",
      });
  }
}
