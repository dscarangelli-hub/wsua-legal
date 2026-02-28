\"use client\";

import { useEffect, useMemo, useState } from \"react\";
import { Button } from \"@/components/ui/button\";
import { cn } from \"@/lib/utils\";

type ExplorerEntity =
  | \"PERSON\"
  | \"ORG\"
  | \"ACTIVITY\"
  | \"DOCUMENT\"
  | \"CASE\"
  | \"SHIPMENT\"
  | \"VERIFICATION\";

type SearchResultGroup = {
  label: string;
  type: ExplorerEntity;
};

const EXPLORER_ITEMS: { label: string; type: ExplorerEntity }[] = [
  { label: \"People\", type: \"PERSON\" },
  { label: \"Organizations\", type: \"ORG\" },
  { label: \"Activities\", type: \"ACTIVITY\" },
  { label: \"Documents\", type: \"DOCUMENT\" },
  { label: \"Cases\", type: \"CASE\" },
  { label: \"Shipments\", type: \"SHIPMENT\" },
  { label: \"Partner Verifications\", type: \"VERIFICATION\" }
];

export default function CrmPage() {
  const [query, setQuery] = useState(\"\");
  const [activeType, setActiveType] = useState<ExplorerEntity>(\"PERSON\");
  const [searchResults, setSearchResults] = useState<any | null>(null);
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<any | null>(null);
  const [relationships, setRelationships] = useState<any[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const run = async () => {
      if (!query.trim()) {
        setSearchResults(null);
        return;
      }
      const res = await fetch(`/api/crm/search?q=${encodeURIComponent(query)}`, {
        signal: controller.signal
      });
      if (!res.ok) return;
      const data = await res.json();
      setSearchResults(data.results);
    };
    const timeout = setTimeout(run, 220);
    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [query]);

  useEffect(() => {
    const loadEntity = async () => {
      if (!selectedEntityId) {
        setSelectedEntity(null);
        setRelationships([]);
        return;
      }
      const [entityRes, relRes] = await Promise.all([
        fetch(`/api/crm/entity/${selectedEntityId}`),
        fetch(`/api/crm/entity/${selectedEntityId}/relationships`)
      ]);
      if (entityRes.ok) {
        const data = await entityRes.json();
        setSelectedEntity(data.entity);
      }
      if (relRes.ok) {
        const data = await relRes.json();
        setRelationships(data.relationships);
      }
    };
    void loadEntity();
  }, [selectedEntityId]);

  const groupedResults: SearchResultGroup[] = useMemo(
    () => [
      { label: \"People\", type: \"PERSON\" },
      { label: \"Organizations\", type: \"ORG\" },
      { label: \"Activities\", type: \"ACTIVITY\" },
      { label: \"Documents\", type: \"DOCUMENT\" },
      { label: \"Cases\", type: \"CASE\" },
      { label: \"Shipments\", type: \"SHIPMENT\" },
      { label: \"Partner Verifications\", type: \"VERIFICATION\" }
    ],
    []
  );

  return (
    <div className=\"flex h-screen flex-col\">
      <header className=\"charcoal-strip flex items-center justify-between border-b border-[color:var(--charcoal-light)] px-8 py-4\">
        <div className=\"flex flex-col\">
          <div className=\"text-xs font-semibold uppercase tracking-[0.2em] text-slate-400\">
            Workspace
          </div>
          <div className=\"mt-1 flex items-baseline gap-4\">
            <h1 className=\"text-lg font-semibold text-slate-50\">CRM</h1>
            <span className=\"h-0.5 w-10 rounded-full bg-[color:var(--wsua-teal)]\" />
          </div>
        </div>
      </header>

      <div className=\"flex flex-1 overflow-hidden\">
        {/* Left Entity Explorer */}
        <aside className=\"hidden h-full w-64 flex-shrink-0 flex-col border-r border-slate-800 bg-[color:var(--charcoal)] text-xs text-slate-100 md:flex\">
          <div className=\"px-4 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-slate-400\">
            Entities
          </div>
          <nav className=\"flex-1 space-y-0.5 px-2 pb-4\">
            {EXPLORER_ITEMS.map((item) => {
              const active = activeType === item.type;
              return (
                <button
                  key={item.type}
                  onClick={() => setActiveType(item.type)}
                  className={cn(
                    \"flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs transition-colors\",
                    active
                      ? \"bg-[color:var(--charcoal-light)] text-slate-50\"
                      : \"text-slate-300 hover:bg-[color:var(--charcoal-light)]\"
                  )}
                >
                  <span>{item.label}</span>
                  {active && (
                    <span className=\"h-1.5 w-1.5 rounded-full bg-[color:var(--wsua-teal)]\" />
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main workspace */}
        <main className=\"workspace-surface flex-1 overflow-auto px-8 py-6\">
          <div className=\"mx-auto flex max-w-6xl flex-col gap-4\">
            {/* Top search bar */}
            <section className=\"space-y-2\">
              <div className=\"flex items-center justify-between\">
                <div>
                  <div className=\"text-xs font-semibold uppercase tracking-[0.16em] text-slate-500\">
                    Global search
                  </div>
                  <p className=\"mt-1 text-xs text-slate-500\">
                    Graph-based search across people, organizations, matters, and activity.
                  </p>
                </div>
              </div>
              <div className=\"relative\">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className=\"w-full rounded-md border border-slate-700 bg-[color:var(--charcoal)] px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--wsua-teal-light)]\"
                  placeholder=\"Search people, organizations, cases, shipments, documents...\"
                />
                {searchResults && (
                  <div className=\"absolute z-10 mt-1 max-h-80 w-full overflow-auto rounded-md border border-slate-200 bg-white text-xs shadow-lg\">
                    {groupedResults.map((group) => {
                      const key =
                        group.type === \"PERSON\"
                          ? \"people\"
                          : group.type === \"ORG\"
                          ? \"organizations\"
                          : group.type === \"ACTIVITY\"
                          ? \"activities\"
                          : group.type === \"DOCUMENT\"
                          ? \"documents\"
                          : group.type === \"CASE\"
                          ? \"cases\"
                          : group.type === \"SHIPMENT\"
                          ? \"shipments\"
                          : \"verifications\";
                      const items = (searchResults as any)[key] as any[];
                      if (!items || items.length === 0) return null;
                      return (
                        <div key={group.type} className=\"border-b border-slate-100 last:border-b-0\">
                          <div className=\"bg-slate-50 px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-slate-500\">
                            {group.label}
                          </div>
                          <ul className=\"divide-y divide-slate-100\">
                            {items.map((item) => (
                              <li
                                key={item.id}
                                className=\"cursor-pointer px-3 py-1.5 hover:bg-slate-50\"
                                onClick={() => {
                                  setSelectedEntityId(item.crmEntityId ?? item.id);
                                  setQuery(\"\");
                                  setSearchResults(null);
                                }}
                              >
                                <div className=\"flex items-center justify-between\">
                                  <span className=\"text-slate-800\">
                                    {item.firstName
                                      ? `${item.firstName} ${item.lastName ?? \"\"}`
                                      : item.name ??
                                        item.title ??
                                        item.trackingNumber ??
                                        item.status}
                                  </span>
                                  <span className=\"text-[0.65rem] text-slate-400\">
                                    {group.label}
                                  </span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>

            {/* Two-column main workspace */}
            <section className=\"grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1.6fr)]\">
              {/* Profile & filters */}
              <div className=\"space-y-3\">
                <div className=\"rounded-lg border border-slate-200 bg-white p-4 text-xs text-slate-700\">
                  <div className=\"flex items-center justify-between\">
                    <div>
                      <div className=\"text-[0.65rem] uppercase tracking-[0.16em] text-slate-400\">
                        Profile
                      </div>
                      <div className=\"mt-1 text-sm font-semibold text-slate-900\">
                        {selectedEntity
                          ? selectedEntity.person?.firstName
                            ? `${selectedEntity.person.firstName} ${selectedEntity.person.lastName ?? \"\"}`
                            : selectedEntity.organization?.name ??
                              selectedEntity.case?.title ??
                              selectedEntity.document?.title ??
                              selectedEntity.shipment?.trackingNumber ??
                              \"Selected entity\"
                          : \"No entity selected\"}
                      </div>
                    </div>
                    {selectedEntity && (
                      <span className=\"rounded-full border border-[color:var(--wsua-teal)] px-3 py-1 text-[0.65rem] uppercase tracking-[0.16em] text-[color:var(--wsua-teal)]\">
                        {selectedEntity.type}
                      </span>
                    )}
                  </div>
                  <div className=\"mt-3 grid grid-cols-2 gap-3\">
                    <div>
                      <div className=\"text-[0.65rem] uppercase tracking-[0.16em] text-slate-400\">
                        Location
                      </div>
                      <div className=\"mt-1 text-xs text-slate-700\">
                        {selectedEntity?.person?.location ??
                          selectedEntity?.organization?.location ??
                          selectedEntity?.shipment?.origin ??
                          \"–\"}
                      </div>
                    </div>
                    <div>
                      <div className=\"text-[0.65rem] uppercase tracking-[0.16em] text-slate-400\">
                        Tags
                      </div>
                      <div className=\"mt-1 flex flex-wrap gap-1\">
                        {(selectedEntity?.person?.tags ??
                          selectedEntity?.organization?.tags ??
                          [])?.map((tag: string) => (
                          <span
                            key={tag}
                            className=\"rounded-full border border-slate-300 px-2 py-0.5 text-[0.65rem] text-slate-600\"
                          >
                            {tag}
                          </span>
                        ))}
                        {(!selectedEntity ||
                          (!selectedEntity.person?.tags &&
                            !selectedEntity.organization?.tags)) && (
                          <span className=\"text-xs text-slate-500\">–</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className=\"mt-3 grid grid-cols-2 gap-3\">
                    <div>
                      <div className=\"text-[0.65rem] uppercase tracking-[0.16em] text-slate-400\">
                        Trust score
                      </div>
                      <div className=\"mt-1 text-xs text-slate-700\">
                        {selectedEntity?.person?.trustScore ?? \"–\"}
                      </div>
                    </div>
                    <div>
                      <div className=\"text-[0.65rem] uppercase tracking-[0.16em] text-slate-400\">
                        Risk flags
                      </div>
                      <div className=\"mt-1 flex flex-wrap gap-1\">
                        {selectedEntity?.person?.riskFlags?.map((flag: string) => (
                          <span
                            key={flag}
                            className=\"rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[0.65rem] text-red-700\"
                          >
                            {flag}
                          </span>
                        )) || <span className=\"text-xs text-slate-500\">–</span>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filters */}
                <div className=\"rounded-lg border border-slate-200 bg-white p-4 text-xs text-slate-700\">
                  <div className=\"flex items-center justify-between\">
                    <div>
                      <div className=\"text-[0.65rem] uppercase tracking-[0.16em] text-slate-400\">
                        Filters
                      </div>
                      <div className=\"mt-1 text-xs text-slate-500\">
                        Location, tags, trust, risk, type, and status.
                      </div>
                    </div>
                  </div>
                  <div className=\"mt-3 grid grid-cols-2 gap-3\">
                    <input
                      className=\"rounded-md border border-slate-200 px-2 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--wsua-teal-light)]\"
                      placeholder=\"Location\"
                    />
                    <input
                      className=\"rounded-md border border-slate-200 px-2 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--wsua-teal-light)]\"
                      placeholder=\"Tags\"
                    />
                    <input
                      className=\"rounded-md border border-slate-200 px-2 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--wsua-teal-light)]\"
                      placeholder=\"Min trust score\"
                    />
                    <input
                      className=\"rounded-md border border-slate-200 px-2 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--wsua-teal-light)]\"
                      placeholder=\"Risk flags\"
                    />
                    <input
                      className=\"rounded-md border border-slate-200 px-2 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--wsua-teal-light)]\"
                      placeholder=\"Organization type\"
                    />
                    <input
                      className=\"rounded-md border border-slate-200 px-2 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--wsua-teal-light)]\"
                      placeholder=\"Case status\"
                    />
                  </div>
                </div>

                {/* Linked vaults placeholder */}
                <div className=\"rounded-lg border border-slate-200 bg-white p-4 text-xs text-slate-700\">
                  <div className=\"flex items-center justify-between\">
                    <div>
                      <div className=\"text-[0.65rem] uppercase tracking-[0.16em] text-slate-400\">
                        Linked vaults
                      </div>
                      <div className=\"mt-1 text-xs text-slate-500\">
                        Relationships between CRM entities and WSUA vaults.
                      </div>
                    </div>
                  </div>
                  <div className=\"mt-2 text-xs text-slate-500\">
                    Vault links will appear here once connected. Each will show vault id,
                    name, and role (claimant, partner, donor, etc.).
                  </div>
                </div>
              </div>

              {/* Graph, relationships, activity */}
              <div className=\"space-y-3\">
                {/* Relationship graph placeholder */}
                <div className=\"rounded-lg border border-slate-200 bg-white p-4 text-xs text-slate-700\">
                  <div className=\"flex items-center justify-between\">
                    <div>
                      <div className=\"text-[0.65rem] uppercase tracking-[0.16em] text-slate-400\">
                        Relationship graph
                      </div>
                      <div className=\"mt-1 text-xs text-slate-500\">
                        Visual map of connected entities (placeholder).
                      </div>
                    </div>
                  </div>
                  <div className=\"mt-3 flex h-32 items-center justify-center rounded-md border border-dashed border-slate-200 text-[0.7rem] text-slate-400\">
                    Graph canvas placeholder – to be backed by actual graph rendering.
                  </div>
                </div>

                {/* Relationship list & creator */}
                <div className=\"rounded-lg border border-slate-200 bg-white p-4 text-xs text-slate-700\">
                  <div className=\"flex items-center justify-between\">
                    <div>
                      <div className=\"text-[0.65rem] uppercase tracking-[0.16em] text-slate-400\">
                        Relationships
                      </div>
                      <div className=\"mt-1 text-xs text-slate-500\">
                        Structured links across people, organizations, cases, and documents.
                      </div>
                    </div>
                  </div>
                  <div className=\"mt-3 flex items-center gap-2\">
                    <input
                      className=\"flex-1 rounded-md border border-slate-200 px-2 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--wsua-teal-light)]\"
                      placeholder=\"Target entity id\"
                    />
                    <input
                      className=\"w-40 rounded-md border border-slate-200 px-2 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--wsua-teal-light)]\"
                      placeholder=\"Relationship type\"
                    />
                    <Button
                      variant=\"default\"
                      size=\"sm\"
                      type=\"button\"
                    >
                      Add relationship
                    </Button>
                  </div>
                  <div className=\"mt-3 space-y-1.5\">
                    {relationships.length === 0 && (
                      <div className=\"text-xs text-slate-500\">
                        No relationships yet for the selected entity.
                      </div>
                    )}
                    {relationships.map((rel) => (
                      <div
                        key={rel.id}
                        className=\"flex items-center justify-between rounded-md border border-slate-200 px-2 py-1 text-[0.7rem]\"
                      >
                        <span className=\"uppercase tracking-[0.16em] text-[color:var(--wsua-teal)]\">
                          {rel.type}
                        </span>
                        <span className=\"text-slate-500\">
                          {rel.fromId} → {rel.toId}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Activity & AI insights placeholder */}
                <div className=\"grid gap-3 md:grid-cols-2\">
                  <div className=\"rounded-lg border border-slate-200 bg-white p-4 text-xs text-slate-700\">
                    <div className=\"flex items-center justify-between\">
                      <div>
                        <div className=\"text-[0.65rem] uppercase tracking-[0.16em] text-slate-400\">
                          Activity history
                        </div>
                        <div className=\"mt-1 text-xs text-slate-500\">
                          Stream of CRM-relevant events for this entity.
                        </div>
                      </div>
                    </div>
                    <div className=\"mt-2 text-xs text-slate-500\">
                      Hook this panel to the Activity model to surface calls, meetings, emails,
                      donations, messages, and more.
                    </div>
                  </div>
                  <div className=\"rounded-lg border border-slate-200 bg-white p-4 text-xs text-slate-700\">
                    <div className=\"flex items-center justify-between\">
                      <div>
                        <div className=\"text-[0.65rem] uppercase tracking-[0.16em] text-slate-400\">
                          AI insights
                        </div>
                        <div className=\"mt-1 text-xs text-slate-500\">
                          Placeholder for AI-ready summaries and risk detection.
                        </div>
                      </div>
                    </div>
                    <div className=\"mt-2 text-xs text-slate-500\">
                      This zone will consume the structured CRM graph, vault links, and activity
                      history to generate context-rich legal intelligence.
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}


