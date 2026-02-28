import { NextRequest, NextResponse } from "next/server";
import { getHomepageModulesForRole } from "@/lib/roles";
import type { UserRole } from "@/lib/roles";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const role = (searchParams.get("role") ?? "general_user") as UserRole;
  const modules = getHomepageModulesForRole(role);
  return NextResponse.json({ role, modules });
}
