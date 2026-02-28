'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { isSelectorComplete } from '@/lib/legal/selector-contract';

const SCENARIO_TAGS = [
  'humanitarian_aid',
  'cross_border',
  'sanctions_compliance',
  'data_protection',
  'ngo_registration',
  'procurement',
  'volunteer_management',
  'partnership_formation',
  'fiscal_sponsorship',
  'grant_compliance',
  'monitoring_evaluation',
];

const RESEARCH_MODES = [
  'summary',
  'obligations',
  'compliance',
  'comparison',
  'conflict',
  'templates',
  'scenario',
];

export default function LegalPage() {
  const [query, setQuery] = useState('');
  const [jurisdictionOptions, setJurisdictionOptions] = useState<Array<{ id: string; code: string; name: string }>>([]);
  const [selectedJurisdictionIds, setSelectedJurisdictionIds] = useState<string[]>([]);
  const [selectorResult, setSelectorResult] = useState<{
    requires_confirmation?: boolean;
    detected_jurisdictions?: Array<{ id: string; code: string; name: string }>;
    confirmed_jurisdictions?: Array<{ id: string; code: string; name: string }> | null;
    confirmation_prompt?: string;
  } | null>(null);
  const [researchResult, setResearchResult] = useState<Record<string, unknown> | null>(null);
  const [scenarioTag, setScenarioTag] = useState('');
  const [mode, setMode] = useState('summary');

  useEffect(() => {
    fetch('/api/legal/jurisdictions')
      .then((r) => r.json())
      .then((list) => setJurisdictionOptions(list));
  }, []);

  const runSelector = async () => {
    const body: { query?: string; explicit_jurisdiction_ids?: string[] } = {};
    if (selectedJurisdictionIds.length) body.explicit_jurisdiction_ids = selectedJurisdictionIds;
    else body.query = query;
    const res = await fetch('/api/legal/jurisdiction-selector', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setSelectorResult(data);
    if (isSelectorComplete(data)) {
      runResearch(data.confirmed_jurisdictions);
    }
  };

  const confirmJurisdictions = async (ids: string[]) => {
    const res = await fetch('/api/legal/jurisdiction-selector/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selected_jurisdiction_ids: ids, query }),
    });
    const data = await res.json();
    setSelectorResult(data);
    if (isSelectorComplete(data)) {
      runResearch(data.confirmed_jurisdictions);
    }
  };

  const runResearch = async (confirmed?: Array<{ id: string }> | null) => {
    const ids = confirmed?.map((j) => j.id) ?? [];
    const res = await fetch('/api/legal/research', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        jurisdictionIds: ids,
        scenarioTag: scenarioTag || undefined,
        mode,
      }),
    });
    const data = await res.json();
    setResearchResult(data);
  };

  return (
    <div className="min-h-full p-6">
      <header className="charcoal-strip -mx-6 -mt-6 flex items-center gap-4 px-6 py-4">
        <span className="text-xs uppercase tracking-wider text-gray-400">
          Workspace
        </span>
        <h1 className="text-lg font-semibold text-white">Legal</h1>
        <span className="h-px flex-1 border-b-2 border-[var(--wsua-teal)]" />
      </header>

      <div className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-600">
            Query
          </label>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. EU data protection and Ukraine"
            className="w-full max-w-2xl rounded border border-gray-300 px-3 py-2 focus:border-[var(--wsua-teal)] focus:ring-1 focus:ring-[var(--wsua-teal)]"
            rows={3}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-600">
            Jurisdiction (optional)
          </label>
          <select
            multiple
            value={selectedJurisdictionIds}
            onChange={(e) =>
              setSelectedJurisdictionIds(
                Array.from(e.target.selectedOptions, (o) => o.value)
              )
            }
            className="w-full max-w-md rounded border border-gray-300 px-3 py-2 focus:border-[var(--wsua-teal)]"
          >
            {jurisdictionOptions.map((j) => (
              <option key={j.id} value={j.id}>
                {j.code} — {j.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="subtle" onClick={runSelector}>
            Run
          </Button>
        </div>

        {selectorResult?.requires_confirmation && (
          <Card className="border-[var(--wsua-teal)]">
            <CardHeader>
              <CardTitle>Confirm jurisdictions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-gray-600">
                {selectorResult.confirmation_prompt}
              </p>
              <div className="flex flex-wrap gap-2">
                {selectorResult.detected_jurisdictions?.map((j) => (
                  <Button
                    key={j.id}
                    variant="default"
                    onClick={() => confirmJurisdictions([j.id])}
                  >
                    Only {j.code}
                  </Button>
                ))}
                <Button
                  variant="subtle"
                  onClick={() =>
                    confirmJurisdictions(
                      selectorResult.detected_jurisdictions?.map((j) => j.id) ?? []
                    )
                  }
                >
                  Include all listed
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-600">
            Scenario
          </label>
          <div className="flex flex-wrap gap-2">
            {SCENARIO_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setScenarioTag(scenarioTag === tag ? '' : tag)}
                className={`rounded border px-2 py-1 text-xs ${
                  scenarioTag === tag
                    ? 'border-[var(--wsua-teal)] text-[var(--wsua-teal)]'
                    : 'border-gray-300'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-600">
            Research mode
          </label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="rounded border border-gray-300 px-3 py-1.5 focus:border-[var(--wsua-teal)]"
          >
            {RESEARCH_MODES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {researchResult && (
          <Card>
            <CardHeader>
              <CardTitle>Result</CardTitle>
              <p className="text-xs text-amber-600">
                {String(researchResult.disclaimer)}
              </p>
            </CardHeader>
            <CardContent>
              <pre className="overflow-auto rounded bg-gray-50 p-4 text-xs">
                {JSON.stringify(researchResult, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
