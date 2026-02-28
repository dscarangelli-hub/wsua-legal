import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createHash } from "crypto";

/**
 * Store user confirmation of jurisdiction(s) and return selected list.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const {
    query,
    detectedJurisdictionIds,
    selectedJurisdictionIds,
  } = body as {
    query?: string;
    detectedJurisdictionIds?: string[];
    selectedJurisdictionIds?: string[];
  };

  const selected = Array.isArray(selectedJurisdictionIds)
    ? selectedJurisdictionIds
    : Array.isArray(detectedJurisdictionIds)
    ? detectedJurisdictionIds
    : [];

  const queryHash = query
    ? createHash("sha256").update(query).digest("hex").slice(0, 32)
    : null;

  const confirmation = await prisma.jurisdictionConfirmation.create({
    data: {
      queryHash: queryHash ?? undefined,
      detectedIds: Array.isArray(detectedJurisdictionIds) ? detectedJurisdictionIds : [],
      selectedIds: selected,
    },
  });

  return NextResponse.json({
    confirmationId: confirmation.id,
    selectedJurisdictionIds: selected,
    merged: selected.length > 1,
  });
}
