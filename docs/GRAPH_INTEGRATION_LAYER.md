# Graph Integration Layer

The Graph Integration Layer connects all legal modules (international, EU, Ukrainian, U.S.), the multilingual ingestion layer, the jurisdiction selector, and the NGO/Template module into a **unified, versioned, queryable graph**. It is the CRM’s authoritative knowledge base for legal documents, obligations, relationships, and template overlays.

---

## 1. Graph Schema (Prisma)

### Node types

| Model | Purpose | Key fields |
|-------|---------|------------|
| **LegalDocument** | Treaties, statutes, regulations, directives, decisions, case law, local acts | document_id (id), title, jurisdictionId, legalLevel, documentType, authority, originalLanguage, rawContent (original_text), normalizedContent (normalized_text), sourceUrl, dateAdopted, effectiveFrom/To, version, previousVersionId, metadata |
| **LegalObligation** | Extracted obligations | obligation_id (id), documentId, text, scope, jurisdictionId, legalBasis, version |
| **LegalTemplate** | NGO/nonprofit templates | template_id (id), title, description, templateType, scenarioTags, jurisdictionId, version, versionHistory (change_log) |
| **LegalTemplateSection** | Sections within templates | section_id (id), templateId, title, content, originalTemplateText, isRequired, order |
| **TemplateOverlay** | Jurisdiction-specific overlays | overlay_id (id), sectionId, jurisdictionId, overlayText, version |
| **GraphDelta** | Machine-readable diffs | delta_id (id), entityType, entityId, oldVersion, newVersion, diff |

### Edge types

- **LegalGraphEdge** (node-to-node): implements, transposes, amends, overrides, interprets, cites, supersedes, depends_on. Metadata, version, timestamps.
- **GraphEdge** (unified, any entity): fromType/fromId, toType/toId, edgeType: implements, transposes, amends, overrides, interprets, cites, supersedes, **requires** (Obligation → TemplateSection), **informs** (LegalDocument → Overlay), **updates** (LegalDocument → Template).

---

## 2. APIs for Legal Modules

Base path: `/api/graph/`.

| Method | Path | Body / params | Description |
|--------|------|----------------|-------------|
| POST | `/documents` | `{ module, title, documentType, jurisdictionId, ... }` | **addLegalDocument** — insert document + graph node |
| POST | `/obligations` | `{ documentId, text, scope?, jurisdictionId?, legalBasis? }` | **addObligation** |
| POST | `/relationships` | `{ sourceType, sourceId, targetType, targetId, relationshipType, metadata?, module? }` | **addRelationship** (GraphEdge) |
| POST | `/documents/[id]/version` | `{ normalizedText?, contentDelta?, changeSummary, module }` | **updateDocumentVersion** — new version, delta, audit, triggers update engine |

Entity types: `LEGAL_DOCUMENT`, `GRAPH_NODE`, `OBLIGATION`, `TEMPLATE`, `TEMPLATE_SECTION`, `OVERLAY`.  
Relationship types: `implements`, `transposes`, `amends`, `overrides`, `interprets`, `cites`, `supersedes`, `requires`, `informs`, `updates`.

---

## 3. APIs for Template Engine

| Method | Path | Description |
|--------|------|-------------|
| GET | `/templates/[id]` | **getTemplate** |
| GET | `/templates/[id]/sections` | **getTemplateSections** (with overlays) |
| GET | `/sections/[id]/overlays` | **getOverlays(sectionId)** |
| PATCH | `/overlays/[id]` | **updateOverlay** — body: `{ overlayText }`, stores delta |
| POST | `/templates/[id]/version` | **createTemplateVersion** — body: `{ changeReason?, changeLog?, delta? }` |

---

## 4. Automatic Update Engine

- **When a legal document is updated** (`updateDocumentVersion`):
  1. Compute delta (stored in LegalDocumentVersion + GraphDelta).
  2. Update graph (version on document).
  3. Identify linked obligations (same document).
  4. Identify templates linked via LegalTemplateLink (graph node) or GraphEdge (updates).
  5. For each template: update TemplateOverlay rows for that document’s jurisdiction, create new LegalTemplateVersion, audit.
- **When a new local act is added**: `onLocalActAdded(documentId, jurisdictionId, module)` — update oblast/city overlays, scenario guidance.
- **When EU or international law changes**: `onEuOrInternationalChange(documentId, module)` — propagate to national/local overlays (calls same chain as document update).

---

## 5. Query Layer (CRM)

All query endpoints accept **jurisdictionIds** (from jurisdiction selector) as query param: `?jurisdictionIds=id1,id2`. If multiple jurisdictions are confirmed, results are merged; legal boundaries are preserved per document/jurisdiction.

| Method | Path | Params | Description |
|--------|------|--------|-------------|
| GET | `/query/documents/[id]` | — | **getLegalDocument** |
| GET | `/query/obligations` | jurisdictionIds, limit, offset | **getObligationsByJurisdiction** |
| GET | `/query/obligations/[id]/trace` | — | **traceObligationFlow** (obligation → document → edges) |
| GET | `/query/templates/scenario/[tag]` | jurisdictionIds, limit | **getTemplatesForScenario** |
| GET | `/query/overlays` | jurisdictionId, templateId? | **getOverlaysForJurisdiction** |
| GET | `/query/conflicts` | jurisdictionIds, limit | **detectConflicts** (overrides/supersedes) |
| GET | `/query/search` | q, jurisdictionIds, limit | **searchLegalDocuments** (multilingual: normalized, raw, title) |
| GET | `/query/recommendations` | scenario, jurisdictionIds | **getTemplateRecommendations** |
| GET | `/query/scenario-guidance` | scenario, jurisdictionIds | **getScenarioGuidance** (templates + linked legal nodes) |

---

## 6. Integration with Jurisdiction Selector

- The CRM (or any client) obtains **confirmed_jurisdictions** from the jurisdiction selector.
- Pass their IDs as **jurisdictionIds** to all graph query endpoints.
- If multiple jurisdictions are confirmed: the query layer merges results and returns unified output; each document/obligation retains its jurisdiction for filtering and display.

---

## 7. File Reference

| Path | Purpose |
|------|---------|
| `prisma/schema.prisma` | LegalDocument (extended), LegalObligation, TemplateOverlay, GraphDelta, GraphEdge, LegalGraphEdge (version), LegalTemplateSection (originalTemplateText), LegalTemplate (templateType), LegalTemplateVersion (changeLog) |
| `src/lib/graph/types.ts` | Entity types, edge types, input DTOs |
| `src/lib/graph/ingestion.ts` | addLegalDocument, addObligation, addRelationship, updateDocumentVersion |
| `src/lib/graph/update-engine.ts` | triggerDocumentUpdateChain, onLocalActAdded, onEuOrInternationalChange |
| `src/lib/graph/template-api.ts` | getTemplate, getTemplateSections, getOverlays, updateOverlay, createTemplateVersion |
| `src/lib/graph/query-layer.ts` | getLegalDocument, getObligationsByJurisdiction, traceObligationFlow, getTemplatesForScenario, getOverlaysForJurisdiction, detectConflicts, searchLegalDocuments, getTemplateRecommendations, getScenarioGuidance |
| `src/app/api/graph/*` | REST routes for ingestion, template, and query |
