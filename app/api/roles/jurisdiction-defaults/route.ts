import { NextRequest, NextResponse } from "next/server";
import { getJurisdictionDefaultsForRole } from "@/lib/roles";
import type { UserRole } from "@/lib/roles";

export async function GET(req: NextRequest) {
  const role = (req.nextUrl.searchParams.get("role") ?? "general_user") as UserRole;
  const jurisdictionIds = await getJurisdictionDefaultsForRole(role);
  return NextResponse.json({ role, jurisdictionIds });
}
