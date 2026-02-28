/**
 * Role-based jurisdiction defaults. Integrates with jurisdiction selector;
 * confirmation workflow still applies.
 */

import type { UserRole } from "./types";
import { prisma } from "@/lib/prisma";

/** Default jurisdiction codes per role (used to suggest/prefill; user must still confirm if multiple). */
export async function getJurisdictionDefaultsForRole(role: UserRole): Promise<string[]> {
  const codesByRole: Record<UserRole, string[]> = {
    legal_professional: [], // no default; explicit selection required
    ngo_nonprofit: ["UA", "EU", "INTERNATIONAL"],
    general_user: ["UA"],
    ukraine_professional: ["UA", "INTERNATIONAL", "EU", "UA_OBLAST", "UA_CITY"],
  };
  const codes = codesByRole[role];
  if (codes.length === 0) return [];

  const jurisdictions = await prisma.jurisdiction.findMany({
    where: { code: { in: codes } },
    select: { id: true },
  });
  return jurisdictions.map((j) => j.id);
}
