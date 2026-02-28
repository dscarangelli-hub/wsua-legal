import { NextRequest, NextResponse } from "next/server";
import { confirmSelector } from "@/lib/legal/jurisdiction-selector";
import type { JurisdictionConfirmInput } from "@/lib/legal/selector-contract";

/**
 * Jurisdiction selector — confirm step (when requires_confirmation was true).
 * Body: { selected_jurisdiction_ids: string[], query? }
 * Returns: JurisdictionSelectorResult with confirmed_jurisdictions set and requires_confirmation false.
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as JurisdictionConfirmInput;
    const result = await confirmSelector({
      selected_jurisdiction_ids: body.selected_jurisdiction_ids ?? [],
      query: body.query,
    });
    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Jurisdiction confirmation failed" },
      { status: 500 }
    );
  }
}
