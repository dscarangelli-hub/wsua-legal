import { NextRequest, NextResponse } from "next/server";
import { addRelationship } from "@/lib/graph/ingestion";
import type { GraphEntityType, GraphEdgeType } from "@/lib/graph/types";

const ENTITY_TYPES: GraphEntityType[] = [
  "LEGAL_DOCUMENT",
  "GRAPH_NODE",
  "OBLIGATION",
  "TEMPLATE",
  "TEMPLATE_SECTION",
  "OVERLAY",
];
const EDGE_TYPES: GraphEdgeType[] = [
  "implements",
  "transposes",
  "amends",
  "overrides",
  "interprets",
  "cites",
  "supersedes",
  "requires",
  "informs",
  "updates",
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sourceType, sourceId, targetType, targetId, relationshipType, metadata, module } = body;
    if (
      !ENTITY_TYPES.includes(sourceType) ||
      !ENTITY_TYPES.includes(targetType) ||
      !EDGE_TYPES.includes(relationshipType) ||
      !sourceId ||
      !targetId
    ) {
      return NextResponse.json(
        { error: "Invalid: sourceType, sourceId, targetType, targetId, relationshipType required and must be valid" },
        { status: 400 }
      );
    }
    const result = await addRelationship(
      { sourceType, sourceId, targetType, targetId, relationshipType, metadata },
      module ? { module } : undefined
    );
    return NextResponse.json(result, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to add relationship" }, { status: 500 });
  }
}
