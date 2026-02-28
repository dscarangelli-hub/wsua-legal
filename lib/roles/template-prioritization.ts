/**
 * Role-based template prioritization. Ranking for template recommendations.
 */

import type { UserRole } from "./types";

export type TemplateTagPriority = { tag: string; weight: number };

const LEGAL_PROFESSIONAL_TAGS: TemplateTagPriority[] = [
  { tag: "legal_analysis", weight: 10 },
  { tag: "citation_framework", weight: 9 },
  { tag: "compliance", weight: 7 },
  { tag: "data_protection", weight: 5 },
];

const NGO_NONPROFIT_TAGS: TemplateTagPriority[] = [
  { tag: "grant_compliance", weight: 10 },
  { tag: "procurement", weight: 9 },
  { tag: "humanitarian", weight: 9 },
  { tag: "partnership", weight: 7 },
  { tag: "mou", weight: 8 },
  { tag: "ngo_registration", weight: 7 },
];

const GENERAL_USER_TAGS: TemplateTagPriority[] = [
  { tag: "simplified", weight: 10 },
  { tag: "public", weight: 9 },
];

const UKRAINE_PROFESSIONAL_TAGS: TemplateTagPriority[] = [
  { tag: "rd4u", weight: 10 },
  { tag: "humanitarian", weight: 9 },
  { tag: "humanitarian_aid", weight: 9 },
  { tag: "ua_ngo", weight: 8 },
  { tag: "oblast", weight: 7 },
  { tag: "data_protection", weight: 5 },
];

export function getTemplatePrioritiesForRole(role: UserRole): TemplateTagPriority[] {
  switch (role) {
    case "legal_professional":
      return LEGAL_PROFESSIONAL_TAGS;
    case "ngo_nonprofit":
      return NGO_NONPROFIT_TAGS;
    case "general_user":
      return GENERAL_USER_TAGS;
    case "ukraine_professional":
      return UKRAINE_PROFESSIONAL_TAGS;
    default:
      return GENERAL_USER_TAGS;
  }
}

/**
 * Rank templates by role: score = sum of (weight for each matching scenario tag).
 */
export function rankTemplatesByRole(
  templates: Array<{ id: string; scenarioTags: string[] }>,
  role: UserRole
): Array<{ id: string; score: number }> {
  const priorities = getTemplatePrioritiesForRole(role);
  const weightByTag = new Map(priorities.map((p) => [p.tag, p.weight]));

  return templates
    .map((t) => {
      let score = 0;
      for (const tag of t.scenarioTags) {
        const w = weightByTag.get(tag) ?? weightByTag.get(tag.toLowerCase()) ?? 0;
        score += w;
      }
      return { id: t.id, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
}
