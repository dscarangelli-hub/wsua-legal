/**
 * Role Optimization Layer — user roles and homepage module definitions.
 */

export const USER_ROLES = [
  "legal_professional",
  "ngo_nonprofit",
  "general_user",
  "ukraine_professional",
] as const;
export type UserRole = (typeof USER_ROLES)[number];

export interface HomepageModule {
  id: string;
  label: string;
  description?: string;
  href?: string;
  icon?: string;
  order: number;
}

const LEGAL_PROFESSIONAL_MODULES: HomepageModule[] = [
  { id: "legal_research", label: "Legal Research Console", href: "/legal", order: 1 },
  { id: "jurisdiction_selector", label: "Jurisdiction Selector", href: "/legal", order: 2 },
  { id: "cross_jurisdictional", label: "Cross-Jurisdictional Comparison", href: "/legal", order: 3 },
  { id: "obligations_explorer", label: "Obligations Explorer", href: "/api/graph/query/obligations", order: 4 },
  { id: "reparations_iccu", label: "Reparations & ICCU Framing", href: "/reparations", order: 5 },
  { id: "document_vault", label: "Document Vault", href: "/vaults", order: 6 },
];

const NGO_NONPROFIT_MODULES: HomepageModule[] = [
  { id: "templates_checklists", label: "Templates & Checklists", href: "/templates", order: 1 },
  { id: "scenario_guidance", label: "Scenario Guidance", href: "/legal", order: 2 },
  { id: "grant_readiness", label: "Grant Readiness", href: "/templates", order: 3 },
  { id: "humanitarian_access", label: "Humanitarian Access Workflows", href: "/templates", order: 4 },
  { id: "rd4u_claim_builder", label: "RD4U Claim Builder", href: "/reparations", order: 5 },
  { id: "evidence_uploader", label: "Evidence Uploader", href: "/reparations", order: 6 },
];

const GENERAL_USER_MODULES: HomepageModule[] = [
  { id: "summaries", label: "High-Level Summaries", href: "/legal", order: 1 },
  { id: "ukraine_overview", label: "Ukraine Situation Overview", href: "/legal", order: 2 },
  { id: "public_templates", label: "Public Templates", href: "/templates", order: 3 },
  { id: "basic_legal", label: "Basic Legal Explanations", href: "/legal", order: 4 },
];

const UKRAINE_PROFESSIONAL_MODULES: HomepageModule[] = [
  { id: "reparations_module", label: "Reparations & Claims Module", href: "/reparations", order: 1 },
  { id: "iccu_framing", label: "ICCU Legal Framing", href: "/reparations", order: 2 },
  { id: "rd4u_packet", label: "RD4U Packet Generator", href: "/reparations", order: 3 },
  { id: "ukrainian_law", label: "Ukrainian Law Explorer", href: "/legal", order: 4 },
  { id: "oblast_city_acts", label: "Oblast/City Normative Acts", href: "/legal", order: 5 },
  { id: "humanitarian_rules", label: "Humanitarian Access Rules", href: "/templates", order: 6 },
];

export function getHomepageModulesForRole(role: UserRole): HomepageModule[] {
  switch (role) {
    case "legal_professional":
      return [...LEGAL_PROFESSIONAL_MODULES].sort((a, b) => a.order - b.order);
    case "ngo_nonprofit":
      return [...NGO_NONPROFIT_MODULES].sort((a, b) => a.order - b.order);
    case "general_user":
      return [...GENERAL_USER_MODULES].sort((a, b) => a.order - b.order);
    case "ukraine_professional":
      return [...UKRAINE_PROFESSIONAL_MODULES].sort((a, b) => a.order - b.order);
    default:
      return [...GENERAL_USER_MODULES].sort((a, b) => a.order - b.order);
  }
}
