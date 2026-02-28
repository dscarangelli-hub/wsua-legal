export type UserRoleType =
  | 'legal_professional'
  | 'ngo_nonprofit'
  | 'general_user'
  | 'ukraine_professional';

export interface HomeModuleDef {
  id: string;
  label: string;
  href?: string;
  description?: string;
}

export const HOME_MODULES_BY_ROLE: Record<UserRoleType, HomeModuleDef[]> = {
  legal_professional: [
    { id: 'legal-research', label: 'Legal Research Console', href: '/legal' },
    { id: 'jurisdiction', label: 'Jurisdiction Selector', href: '/legal' },
    { id: 'cross-jurisdictional', label: 'Cross-Jurisdictional Comparison', href: '/legal' },
    { id: 'obligations', label: 'Obligations Explorer', href: '/legal' },
    { id: 'reparations-iccu', label: 'Reparations & ICCU Framing', href: '/reparations' },
    { id: 'document-vault', label: 'Document Vault', href: '/vaults' },
  ],
  ngo_nonprofit: [
    { id: 'templates', label: 'Templates & Checklists', href: '/templates' },
    { id: 'scenario', label: 'Scenario Guidance', href: '/legal' },
    { id: 'grant', label: 'Grant Readiness', href: '/templates' },
    { id: 'humanitarian', label: 'Humanitarian Access Workflows', href: '/reparations' },
    { id: 'rd4u-builder', label: 'RD4U Claim Builder', href: '/reparations' },
    { id: 'evidence', label: 'Evidence Uploader', href: '/reparations' },
  ],
  general_user: [
    { id: 'summaries', label: 'High-Level Summaries' },
    { id: 'ukraine-overview', label: 'Ukraine Situation Overview' },
    { id: 'public-templates', label: 'Public Templates', href: '/templates' },
    { id: 'basic-legal', label: 'Basic Legal Explanations', href: '/legal' },
  ],
  ukraine_professional: [
    { id: 'reparations', label: 'Reparations & Claims Module', href: '/reparations' },
    { id: 'iccu', label: 'ICCU Legal Framing', href: '/reparations' },
    { id: 'rd4u-packet', label: 'RD4U Packet Generator', href: '/reparations' },
    { id: 'ukrainian-law', label: 'Ukrainian Law Explorer', href: '/legal' },
    { id: 'oblast-city', label: 'Oblast/City Normative Acts', href: '/legal' },
    { id: 'humanitarian-access', label: 'Humanitarian Access Rules', href: '/reparations' },
  ],
};

export const JURISDICTION_DEFAULTS_BY_ROLE: Record<UserRoleType, string[]> = {
  legal_professional: [],
  ngo_nonprofit: ['UA', 'EU', 'INTERNATIONAL'],
  general_user: ['UA'],
  ukraine_professional: ['UA', 'INTERNATIONAL', 'EU', 'UA_OBLAST', 'UA_CITY'],
};

export const TEMPLATE_PRIORITY_BY_ROLE: Record<UserRoleType, string[]> = {
  legal_professional: ['legal_analysis', 'citation_framework'],
  ngo_nonprofit: ['operational', 'mou', 'grant_template'],
  general_user: ['simplified'],
  ukraine_professional: ['rd4u', 'humanitarian_access', 'ukrainian_ngo_form'],
};
