# Jurisdiction Selector — Integration Guide

The jurisdiction selector sits at the top of the federated legal-intelligence system. It classifies user queries, detects relevant jurisdictions, and requests **formal confirmation** when multiple jurisdictions are implicated. **No downstream module (multilingual ingestion, legal modules, unified graph, NGO/template module, research assistant) should be invoked until the selector has completed.**

---

## 1. Supported Jurisdictions

| Code | Name |
|------|------|
| `INTERNATIONAL` | International law (UN, ECHR, IHL, sanctions, etc.) |
| `EU` | EU law (TEU, TFEU, Regulations, Directives, CJEU) |
| `UA` | Ukrainian national law |
| `UA_OBLAST` | Ukrainian oblast-level law |
| `UA_CITY` | Ukrainian city-level law |
| `US` | U.S. federal law |
| `US_CIRCUIT` | U.S. circuit (Courts of Appeals) |
| `US_STATE` | U.S. state law |

These must exist in the `Jurisdiction` table (see `prisma/seed.ts`).

---

## 2. Two Modes

### Explicit selection mode

- **When:** The user chooses one or more jurisdictions (e.g. via UI chips).
- **Input:** `explicit_jurisdiction_ids: string[]` (DB jurisdiction IDs).
- **Behavior:** Route directly to the selected module(s). No detection, no confirmation.
- **Output:** `mode: "explicit"`, `requires_confirmation: false`, `confirmed_jurisdictions: [...]`.

### Jurisdiction-agnostic mode

- **When:** The user does **not** choose a jurisdiction and submits a query.
- **Input:** `query: string`.
- **Behavior:**
  1. Run the **jurisdiction classifier** on the query (citations, institutions, language, document types, keywords).
  2. Map classifier codes to DB jurisdictions; get a **ranked list** of detected jurisdictions.
  3. **If 0 detected:** Return suggested jurisdictions (e.g. top-level list); `confirmed_jurisdictions: null`.
  4. **If 1 detected:** Auto-confirm; set `confirmed_jurisdictions: [that one]`, `requires_confirmation: false`.
  5. **If 2+ detected:** Set `requires_confirmation: true`, `confirmed_jurisdictions: null`, and a **confirmation prompt**.
- **After user confirms:** Call the **confirm** endpoint with `selected_jurisdiction_ids`. Response then has `requires_confirmation: false` and `confirmed_jurisdictions` set.

---

## 3. Output Contract

Every selector response (resolve and confirm) returns a structured object:

```ts
{
  "mode": "explicit" | "agnostic",
  "detected_jurisdictions": [
    { "id": "uuid", "code": "EU", "name": "European Union", "layer": "regional", "score?": 0.95 }
  ],
  "requires_confirmation": true | false,
  "confirmed_jurisdictions": null | [
    { "id": "uuid", "code": "UA", "name": "Ukraine", "layer": "national" }
  ],
  "confirmation_prompt?": "This query appears to involve the following jurisdictions: ..."
}
```

- **`mode`** — Whether the user chose explicitly or the system ran in agnostic mode.
- **`detected_jurisdictions`** — Ranked list from the classifier (agnostic). Empty when explicit or after confirm.
- **`requires_confirmation`** — `true` only when multiple jurisdictions were detected and the user has not yet confirmed.
- **`confirmed_jurisdictions`** — Set after explicit selection or after the user confirms in agnostic mode. **Null while waiting for confirmation.**

**Rule:** Downstream modules may run only when `requires_confirmation === false` and `confirmed_jurisdictions` is non-null (and preferably non-empty). Use the helper:

```ts
import { isSelectorComplete } from "@/lib/legal/selector-contract";
if (isSelectorComplete(selectorResult)) {
  const ids = selectorResult.confirmed_jurisdictions!.map((j) => j.id);
  // invoke ingestion, graph, template, or research with ids
}
```

---

## 4. Detection Logic (Classifier)

The classifier in `src/lib/legal/jurisdiction-classifier.ts` uses:

- **Citation formats:** e.g. CFR, U.S.C., CELEX, Ukrainian statute patterns (Закон, Кодекс, постанова КМУ), ECHR, UN doc numbers.
- **Institutional names:** e.g. CJEU, Верховний Суд, 9th Circuit, Supreme Court of Ukraine.
- **Language cues:** Cyrillic text → Ukrainian.
- **Document types:** treaty, regulation, directive, state statute, circuit opinion, etc.
- **Keywords:** humanitarian, sanctions, NGO, donor, GDPR, etc.

It returns a **ranked list** of jurisdiction codes with scores and signals. The selector maps these codes to DB jurisdictions and applies the single/multi logic above.

---

## 5. How Other Modules Call the Selector

### HTTP API

1. **Resolve**
   - `POST /api/legal/jurisdiction-selector`
   - Body: `{ "query"?: string, "explicit_jurisdiction_ids"?: string[] }`
   - Response: `JurisdictionSelectorResult`.

2. **Confirm** (only when `requires_confirmation` was true)
   - `POST /api/legal/jurisdiction-selector/confirm`
   - Body: `{ "selected_jurisdiction_ids": string[], "query"?: string }`
   - Response: `JurisdictionSelectorResult` with `confirmed_jurisdictions` set.

### From application code (e.g. server action or backend job)

```ts
import { resolveSelector, confirmSelector, getModulesForConfirmedJurisdictions } from "@/lib/legal/jurisdiction-selector";
import { isSelectorComplete } from "@/lib/legal/selector-contract";

// Step 1: Resolve
const result = await resolveSelector({
  query: userQuery,
  explicit_jurisdiction_ids: userSelectedIds?.length ? userSelectedIds : undefined,
});

if (result.requires_confirmation) {
  // Pause: show UI with result.detected_jurisdictions and result.confirmation_prompt.
  // When user chooses, call confirmSelector({ selected_jurisdiction_ids: [...] }).
  return;
}

if (!isSelectorComplete(result)) return;

const jurisdictionIds = result.confirmed_jurisdictions!.map((j) => j.id);
const modules = getModulesForConfirmedJurisdictions(result.confirmed_jurisdictions!);
// Now invoke: multilingual ingestion, legal module(s), graph, template module, research — with jurisdictionIds / modules.
```

**Routing:** `getModulesForConfirmedJurisdictions(confirmed)` returns which legal modules to run: `INTERNATIONAL`, `EU`, `UKRAINE`, `US`. Subnational codes (e.g. UA_OBLAST, US_CIRCUIT) are mapped to their parent (UKRAINE, US) for module routing; the graph can still store finer-grained jurisdiction.

---

## 6. Integration Points (Do Not Call Until Selector Complete)

| Consumer | When to call | What to pass |
|----------|----------------|--------------|
| Multilingual ingestion | After `isSelectorComplete(result)` | `confirmed_jurisdictions` (for tagging) |
| Legal modules (International, EU, Ukraine, U.S.) | After selector complete | `getModulesForConfirmedJurisdictions(confirmed)` |
| Unified legal graph | After selector complete | `confirmed_jurisdictions[].id` for filtering |
| NGO/Template module | After selector complete | `confirmed_jurisdictions` for jurisdiction-aware templates |
| Research assistant | After selector complete | `confirmed_jurisdictions[].id` as `jurisdictionIds` |

---

## 7. Tests

- **Classifier:** `src/lib/legal/__tests__/jurisdiction-classifier.test.ts` — multi-jurisdiction detection, single detection, ranking, signals, `getDetectedCodes`.
- **Contract:** `src/lib/legal/__tests__/selector-contract.test.ts` — `isSelectorComplete` for all branches.

Run: `npm test` (with Jest configured) or run the test files with your Node test runner.
