# NGO / Nonprofit Operational Module — Template Engine

## Purpose

Provide curated, jurisdiction-aware templates and scenario-specific guidance for NGOs and nonprofits. Legally neutral and non-advisory.

## Template Object Model

- **LegalTemplate** — name, description, jurisdiction, source (UN_OCHA, SPHERE, CHS, ICRC, EU_GRANT, GDPR_DPA, UA_NGO, US_IRS, etc.), version, scenarioTags, isActive.
- **LegalTemplateSection** — key, title, content, isRequired, order, **overlays** (JSON: jurisdiction code → jurisdiction-specific content).
- **LegalTemplateLink** — links template to **LegalGraphNode** with role (basis | requirement | reference).
- **LegalTemplateVersion** — version, changeReason, delta; previous versions preserved.

## Automatic Template Update Engine

When a linked law (graph node) changes:

1. Detect affected templates via `LegalTemplateLink`.
2. **applyTemplateUpdate** — Update section overlays, annotations, required/optional sections; increment template version; store delta in `LegalTemplateVersion`; preserve previous version.

See `src/lib/legal/template-engine.ts`.

## Scenario Guidance Engine

- **getScenarioGuidance(scenarioId, jurisdictionIds)** — Returns scenario label, description, template IDs, and linked legal node IDs. Does not draft documents or give legal advice.
- Scenario IDs: humanitarian, cross_border, sanctions, data_protection, ngo_registration, procurement, volunteer, partnership, fiscal_sponsorship, grant_compliance, monitoring_eval.

## Template Sources (Curated)

UN OCHA, Sphere Standards, CHS, ICRC, IFRC, EU grant templates, GDPR DPA templates, Ukrainian NGO registration forms, oblast/city humanitarian access forms, U.S. IRS and state charity templates.

## API

- **GET /api/legal/templates** — Query params: `jurisdictionId`, `scenarioTag`, `source`, `limit`.
