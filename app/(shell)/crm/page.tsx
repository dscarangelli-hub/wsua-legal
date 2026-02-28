'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ENTITY_LABELS = [
  'People',
  'Organizations',
  'Activities',
  'Documents',
  'Cases',
  'Shipments',
  'Partner Verifications',
] as const;

type EntityCategory = (typeof ENTITY_LABELS)[number];

interface SearchResults {
  people: Array<{ id: string; firstName?: string; lastName?: string; email?: string }>;
  organizations: Array<{ id: string; name: string }>;
  activities: Array<{ id: string; type: string; description?: string }>;
  documents: Array<{ id: string; title: string }>;
  cases: Array<{ id: string; title: string }>;
  shipments: Array<{ id: string; trackingNumber?: string }>;
  verifications: Array<{ id: string; status?: string }>;
}

export default function CRMPage() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [entity, setEntity] = useState<Record<string, unknown> | null>(null);
  const [relationships, setRelationships] = useState<unknown[]>([]);
  const [activeCategory, setActiveCategory] = useState<EntityCategory>('People');
  const [relTargetId, setRelTargetId] = useState('');
  const [relType, setRelType] = useState('');

  const runSearch = useCallback(async () => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }
    const res = await fetch(`/api/crm/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setSearchResults(data);
  }, [query]);

  useEffect(() => {
    const t = setTimeout(runSearch, 300);
    return () => clearTimeout(t);
  }, [query, runSearch]);

  useEffect(() => {
    if (!selectedEntityId) {
      setEntity(null);
      setRelationships([]);
      return;
    }
    (async () => {
      const [eRes, rRes] = await Promise.all([
        fetch(`/api/crm/entity/${selectedEntityId}`),
        fetch(`/api/crm/entity/${selectedEntityId}/relationships`),
      ]);
      const eData = await eRes.json();
      const rData = await rRes.json();
      setEntity(eRes.ok ? eData : null);
      setRelationships(rRes.ok ? rData : []);
    })();
  }, [selectedEntityId]);

  const selectFromSearch = (id: string, crmEntityId?: string | null) => {
    setSelectedEntityId(crmEntityId ?? id);
    setSearchResults(null);
    setQuery('');
  };

  const addRelationship = async () => {
    if (!selectedEntityId || !relTargetId || !relType) return;
    await fetch('/api/crm/relationship', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fromId: selectedEntityId,
        toId: relTargetId,
        type: relType,
      }),
    });
    setRelTargetId('');
    setRelType('');
    const rRes = await fetch(`/api/crm/entity/${selectedEntityId}/relationships`);
    const rData = await rRes.json();
    setRelationships(rData);
  };

  const displayName = entity
    ? entity.person
      ? `${(entity.person as { firstName?: string }).firstName} ${(entity.person as { lastName?: string }).lastName}`
      : entity.organization
        ? (entity.organization as { name: string }).name
        : entity.case
          ? (entity.case as { title: string }).title
          : entity.document
            ? (entity.document as { title: string }).title
            : entity.shipment
              ? (entity.shipment as { trackingNumber?: string }).trackingNumber ?? entity.id
              : entity.id
    : null;

  return (
    <div className="flex h-full min-h-[80vh]">
      <header className="absolute left-0 right-0 top-0 charcoal-strip z-10 flex items-center gap-4 px-6 py-4">
        <span className="text-xs uppercase tracking-wider text-gray-400">
          Workspace
        </span>
        <h1 className="text-lg font-semibold text-white">CRM</h1>
        <span className="h-px flex-1 border-b-2 border-[var(--wsua-teal)]" />
      </header>

      <aside className="mt-14 w-48 flex-shrink-0 border-r border-gray-200 bg-[var(--charcoal)] p-3">
        <p className="text-xs font-semibold uppercase text-gray-400">Entities</p>
        <ul className="mt-2 space-y-0.5">
          {ENTITY_LABELS.map((label) => (
            <li key={label}>
              <button
                type="button"
                onClick={() => setActiveCategory(label)}
                className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm ${
                  activeCategory === label
                    ? 'bg-[var(--charcoal-light)] text-[var(--wsua-teal-light)]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {activeCategory === label && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--wsua-teal)]" />
                )}
                {label}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="flex-1 overflow-auto p-6 pt-20">
        <div className="mb-4">
          <input
            type="search"
            placeholder="Search all CRM entities..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full max-w-md rounded border border-[var(--charcoal-light)] bg-[var(--charcoal)] px-3 py-2 text-white placeholder-gray-400 focus:border-[var(--wsua-teal)] focus:ring-1 focus:ring-[var(--wsua-teal)]"
          />
          {searchResults && (
            <div className="absolute z-20 mt-1 max-h-64 w-full max-w-md overflow-auto rounded border border-gray-200 bg-white shadow-lg">
              {searchResults.people.length > 0 && (
                <div className="border-b p-2">
                  <p className="text-xs font-semibold text-gray-500">People</p>
                  {searchResults.people.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className="block w-full rounded px-2 py-1 text-left text-sm hover:bg-gray-100"
                      onClick={() => selectFromSearch(p.id, (p as { crmEntityId?: string | null }).crmEntityId)}
                    >
                      {p.firstName} {p.lastName}
                    </button>
                  ))}
                </div>
              )}
              {searchResults.organizations.length > 0 && (
                <div className="border-b p-2">
                  <p className="text-xs font-semibold text-gray-500">Organizations</p>
                  {searchResults.organizations.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      className="block w-full rounded px-2 py-1 text-left text-sm hover:bg-gray-100"
                      onClick={() => selectFromSearch(o.id, (o as { crmEntityId?: string | null }).crmEntityId)}
                    >
                      {o.name}
                    </button>
                  ))}
                </div>
              )}
              {searchResults.cases.length > 0 && (
                <div className="p-2">
                  <p className="text-xs font-semibold text-gray-500">Cases</p>
                  {searchResults.cases.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      className="block w-full rounded px-2 py-1 text-left text-sm hover:bg-gray-100"
                      onClick={() => selectFromSearch(c.id, (c as { crmEntityId?: string | null }).crmEntityId)}
                    >
                      {c.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {displayName ?? 'Profile'}
                  {entity && (
                    <span className="rounded border border-[var(--wsua-teal)] px-2 py-0.5 text-xs text-[var(--wsua-teal)]">
                      {(entity as { type?: string }).type}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                {entity && (
                  <pre className="whitespace-pre-wrap break-words text-xs">
                    {JSON.stringify(
                      {
                        ...entity.person,
                        ...entity.organization,
                        ...entity.activity,
                        ...entity.case,
                        ...entity.shipment,
                        ...entity.partnerVerification,
                      },
                      null,
                      2
                    )}
                  </pre>
                )}
                {!selectedEntityId && (
                  <p>Select an entity from search or use the entity list.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Linked Vaults</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-500">
                Vault links (vaultId, vaultName, role) — ready to bind to VaultLink
                records.
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="border-2 border-dashed border-gray-300">
              <CardHeader>
                <CardTitle className="text-[var(--wsua-teal)]">
                  Graph canvas placeholder
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-500">
                Future graph visualization.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Relationships</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <input
                    placeholder="Target entity ID"
                    value={relTargetId}
                    onChange={(e) => setRelTargetId(e.target.value)}
                    className="rounded border border-gray-300 px-2 py-1 text-sm focus:border-[var(--wsua-teal)]"
                  />
                  <input
                    placeholder="Type (e.g. EMPLOYED_BY)"
                    value={relType}
                    onChange={(e) => setRelType(e.target.value)}
                    className="rounded border border-gray-300 px-2 py-1 text-sm focus:border-[var(--wsua-teal)]"
                  />
                  <Button
                    variant="default"
                    onClick={addRelationship}
                    disabled={!selectedEntityId || !relTargetId || !relType}
                  >
                    Add relationship
                  </Button>
                </div>
                <ul className="space-y-1">
                  {(relationships as Array<{ id: string; type: string; fromId: string; toId: string }>).map(
                    (r) => (
                      <li
                        key={r.id}
                        className="rounded border border-[var(--wsua-teal)] px-2 py-1 text-xs text-[var(--wsua-teal)]"
                      >
                        {r.type}: {r.fromId} → {r.toId}
                      </li>
                    )
                  )}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activity history</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-500">
                Hook to Activity model (calls, meetings, messages).
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI insights</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-500">
                Future AI-ready summaries and risk detection.
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
