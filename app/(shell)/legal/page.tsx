"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SCENARIO_TAGS } from "@/lib/legal/types";
import {
  isSelectorComplete,
  type JurisdictionSelectorResult,
  type JurisdictionItem,
} from "@/lib/legal/selector-contract";

type ResearchMode =
  | "summary"
  | "obligations"
  | "compliance"
  | "comparison"
  | "conflict"
  | "templates"
  | "scenario";

const RESEARCH_MODES: { id: ResearchMode; label: string }[] = [
  { id: "summary", label: "Summary" },
  { id: "obligations", label: "Obligation extraction" },
  { id: "compliance", label: "Compliance mapping" },
  { id: "comparison", label: "Cross-jurisdictional comparison" },
  { id: "conflict", label: "Conflict detection" },
  { id: "templates", label: "Template recommendations" },
  { id: "scenario", label: "Scenario guidance" },
];

export default function LegalPage() {
  const [query, setQuery] = useState("");
  const [selectedJurisdictionIds, setSelectedJurisdictionIds] = useState<string[]>([]);
  const [jurisdictions, setJurisdictions] = useState<JurisdictionItem[]>([]);
  const [selectorResult, setSelectorResult] = useState<JurisdictionSelectorResult | null>(null);
  const [pendingQuery, setPendingQuery] = useState("");
  const [scenarioTag, setScenarioTag] = useState<string>("");
  const [researchMode, setResearchMode] = useState<ResearchMode>("summary");
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  const loadJurisdictions = useCallback(async () => {
    const res = await fetch("/api/legal/jurisdictions");
    if (res.ok) {
      const data = await res.json();
      setJurisdictions(data.jurisdictions ?? []);
    }
  }, []);

  const runSelector = useCallback(async () => {
    setLoading(true);
    setResult(null);
    setSelectorResult(null);
    try {
      const body: { query?: string; explicit_jurisdiction_ids?: string[] } = selectedJurisdictionIds.length
        ? { explicit_jurisdiction_ids: selectedJurisdictionIds }
        : { query: query.trim() };
      if (!body.query && !body.explicit_jurisdiction_ids?.length) {
        setLoading(false);
        return;
      }
      const res = await fetch("/api/legal/jurisdiction-selector", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data: JurisdictionSelectorResult = await res.json();
      setSelectorResult(data);
      if (data.detected_jurisdictions?.length) setJurisdictions(data.detected_jurisdictions);
      if (data.requires_confirmation) {
        setPendingQuery(query.trim());
        setLoading(false);
        return;
      }
      if (isSelectorComplete(data) && data.confirmed_jurisdictions?.length) {
        const ids = data.confirmed_jurisdictions.map((j) => j.id);
        await runResearch(query.trim() || pendingQuery, ids);
      }
    } catch (e) {
      setResult({ error: String(e) });
    }
    setLoading(false);
  }, [query, selectedJurisdictionIds, pendingQuery]);

  const runResearch = useCallback(
    async (q: string, jurisdictionIds: string[]) => {
      if (!q.trim()) return;
      setLoading(true);
      setResult(null);
      try {
        const res = await fetch("/api/legal/research", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: q,
            jurisdictionIds,
            scenarioTag: scenarioTag || undefined,
            mode: researchMode,
          }),
        });
        const data = await res.json();
        setResult(data);
      } catch (e) {
        setResult({ error: String(e) });
      }
      setLoading(false);
    },
    [scenarioTag, researchMode]
  );

  const confirmJurisdictions = useCallback(
    async (selectedIds: string[]) => {
      setLoading(true);
      try {
        const res = await fetch("/api/legal/jurisdiction-selector/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            selected_jurisdiction_ids: selectedIds,
            query: pendingQuery,
          }),
        });
        const data: JurisdictionSelectorResult = await res.json();
        setSelectorResult(data);
        if (isSelectorComplete(data) && data.confirmed_jurisdictions?.length) {
          await runResearch(pendingQuery, data.confirmed_jurisdictions.map((j) => j.id));
        }
      } catch (e) {
        setResult({ error: String(e) });
      }
      setLoading(false);
    },
    [pendingQuery, runResearch]
  );

  const showConfirmation =
    selectorResult?.requires_confirmation === true &&
    (selectorResult.detected_jurisdictions?.length ?? 0) > 0;
  const detectedForConfirm = selectorResult?.detected_jurisdictions ?? [];

  return (
    <div className="flex h-screen flex-col">
      <header className="charcoal-strip flex items-center justify-between border-b border-[color:var(--charcoal-light)] px-8 py-4">
        <div className="flex flex-col">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Federated Legal Intelligence
          </div>
          <div className="mt-1 flex items-baseline gap-4">
            <h1 className="text-lg font-semibold text-slate-50">Legal</h1>
            <span className="h-0.5 w-10 rounded-full bg-[color:var(--wsua-teal)]" />
          </div>
        </div>
      </header>

      <main className="workspace-surface flex-1 overflow-auto px-8 py-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* User query + jurisdiction selector */}
          <section className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-slate-500">
              User query &amp; jurisdiction
            </div>
            <p className="mt-1 text-xs text-slate-600">
              Choose a jurisdiction (explicit) or leave unset for jurisdiction-agnostic mode (detection + confirmation when multiple apply).
            </p>
            <div className="mt-3 flex flex-col gap-3">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. CFR 31 and EU Regulation 2022/2065; Ukrainian NGO registration and 9th Circuit precedent"
                className="min-h-[80px] w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--wsua-teal-light)]"
                onFocus={loadJurisdictions}
              />
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-500">Jurisdiction (optional):</span>
                {jurisdictions.length === 0 && (
                  <button
                    type="button"
                    onClick={loadJurisdictions}
                    className="text-xs text-[color:var(--wsua-teal)] underline"
                  >
                    Load jurisdictions
                  </button>
                )}
                {jurisdictions.slice(0, 10).map((j) => (
                  <button
                    key={j.id}
                    type="button"
                    onClick={() =>
                      setSelectedJurisdictionIds((prev) =>
                        prev.includes(j.id) ? prev.filter((id) => id !== j.id) : [...prev, j.id]
                      )
                    }
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-xs",
                      selectedJurisdictionIds.includes(j.id)
                        ? "border-[color:var(--wsua-teal)] bg-teal-50 text-[color:var(--wsua-teal)]"
                        : "border-slate-300 text-slate-600 hover:border-slate-400"
                    )}
                  >
                    {j.code}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={runSelector}
                  disabled={loading || (!query.trim() && !selectedJurisdictionIds.length)}
                >
                  {loading ? "Running…" : selectedJurisdictionIds.length ? "Run (explicit)" : "Run (detect)"}
                </Button>
              </div>
            </div>
          </section>

          {/* Formal confirmation step — no module runs until user confirms */}
          {showConfirmation && (
            <section className="rounded-lg border-2 border-[color:var(--wsua-teal)] bg-amber-50/50 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">
                Confirm jurisdictions
              </div>
              <p className="mt-1 text-xs text-slate-600">
                {selectorResult.confirmation_prompt ?? "This query appears to involve the following jurisdictions. Confirm whether the analysis should include all listed or be limited to a specific one."}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {detectedForConfirm.map((j) => (
                  <button
                    key={j.id}
                    type="button"
                    onClick={() => confirmJurisdictions([j.id])}
                    className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-700 hover:border-[color:var(--wsua-teal)]"
                  >
                    Only {j.name}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => confirmJurisdictions(detectedForConfirm.map((j) => j.id))}
                  className="rounded-md border border-[color:var(--wsua-teal)] bg-teal-50 px-3 py-1.5 text-xs font-medium text-[color:var(--wsua-teal)]"
                >
                  Include all listed
                </button>
              </div>
            </section>
          )}

          {/* Selector status */}
          {selectorResult && !showConfirmation && (
            <section className="rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-600">
              <span className="font-medium text-slate-700">Selector: </span>
              mode={selectorResult.mode}
              {selectorResult.confirmed_jurisdictions?.length
                ? ` · confirmed: ${selectorResult.confirmed_jurisdictions.map((j) => j.code).join(", ")}`
                : ""}
            </section>
          )}

          {/* Scenario selector */}
          <section className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Scenario (NGO / humanitarian)
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {SCENARIO_TAGS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setScenarioTag((prev) => (prev === s.id ? "" : s.id))}
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-[0.7rem]",
                    scenarioTag === s.id
                      ? "border-[color:var(--wsua-teal)] text-[color:var(--wsua-teal)]"
                      : "border-slate-200 text-slate-600"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </section>

          {/* Research mode */}
          <section className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Research mode
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {RESEARCH_MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setResearchMode(m.id)}
                  className={cn(
                    "rounded-md border px-2 py-1 text-xs",
                    researchMode === m.id
                      ? "border-[color:var(--wsua-teal)] bg-teal-50 text-[color:var(--wsua-teal)]"
                      : "border-slate-200 text-slate-600"
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </section>

          {/* Result + disclaimer */}
          {result && (
            <section className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-semibold text-slate-700">Result</span>
                {result.disclaimer && (
                  <span className="text-[0.65rem] italic text-slate-500">
                    Research only; not legal advice
                  </span>
                )}
              </div>
              <pre className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap rounded bg-slate-50 p-3 text-xs text-slate-800">
                {JSON.stringify(result, null, 2)}
              </pre>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
