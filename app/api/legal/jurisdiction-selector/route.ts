import { NextRequest, NextResponse } from "next/server";
import { resolveSelector } from "@/lib/legal/jurisdiction-selector";
import type { JurisdictionSelectorInput } from "@/lib/legal/selector-contract";

/**
 * Jurisdiction selector — resolve step.
 * Body: { query?, explicit_jurisdiction_ids? }
 * Returns: JurisdictionSelectorResult (mode, detected_jurisdictions, requires_confirmation, confirmed_jurisdictions).
 * No downstream module should run until requires_confirmation === false and confirmed_jurisdictions is set.
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as JurisdictionSelectorInput;
    const result = await resolveSelector({
      query: body.query,
      explicit_jurisdiction_ids: body.explicit_jurisdiction_ids,
    });
    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Jurisdiction selector failed" },
      { status: 500 }
    );
  }
}
