"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const MODULES = [
  { id: "start_claim", label: "Start RD4U claim", href: "#", description: "Create a new reparations claim" },
  { id: "upload_evidence", label: "Upload evidence", href: "#", description: "Photos, videos, documents, testimonies" },
  { id: "classify_harm", label: "Classify harm", href: "#", description: "Map evidence to RD4U categories" },
  { id: "generate_packet", label: "Generate RD4U packet", href: "#", description: "Exportable PDF, JSON, XML (EN/UA)" },
  { id: "iccu_framing", label: "ICCU framing", href: "#", description: "Legal framing (IHL, HR, aggression)" },
  { id: "compensation_readiness", label: "Compensation readiness", href: "#", description: "Status, eligibility, payment readiness" },
  { id: "case_tracking", label: "Case tracking", href: "#", description: "Track claim status" },
];

export default function ReparationsPage() {
  const [categories, setCategories] = useState<{ id: string; categoryId: string; title: string }[]>([]);
  const [claims, setClaims] = useState<{ id: string; title: string; status: string }[]>([]);

  useEffect(() => {
    fetch("/api/reparations/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories ?? []))
      .catch(() => {});
    fetch("/api/reparations/claims")
      .then((r) => r.json())
      .then((d) => setClaims(d.claims ?? []))
      .catch(() => {});
  }, []);

  return (
    <div className="flex h-screen flex-col">
      <header className="charcoal-strip flex items-center justify-between border-b border-[color:var(--charcoal-light)] px-8 py-4">
        <div className="flex flex-col">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Ukraine Reparations & Claims
          </div>
          <div className="mt-1 flex items-baseline gap-4">
            <h1 className="text-lg font-semibold text-slate-50">RD4U & ICCU</h1>
            <span className="h-0.5 w-10 rounded-full bg-[color:var(--wsua-teal)]" />
          </div>
        </div>
      </header>

      <main className="workspace-surface flex-1 overflow-auto px-8 py-6">
        <div className="mx-auto max-w-5xl space-y-6">
          <section>
            <h2 className="text-sm font-semibold tracking-wide text-slate-700 mb-3">Module shortcuts</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {MODULES.map((m) => (
                <Card key={m.id} className="border border-slate-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{m.label}</CardTitle>
                    <CardDescription className="text-xs">{m.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold tracking-wide text-slate-700 mb-3">RD4U categories</h2>
            {categories.length === 0 ? (
              <p className="text-xs text-slate-500">No categories yet. Create via API or seed.</p>
            ) : (
              <ul className="space-y-1 text-xs">
                {categories.map((c) => (
                  <li key={c.id} className="flex items-center gap-2">
                    <span className="font-medium text-slate-800">{c.title}</span>
                    <span className="text-slate-500">({c.categoryId})</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="text-sm font-semibold tracking-wide text-slate-700 mb-3">Your claims</h2>
            {claims.length === 0 ? (
              <p className="text-xs text-slate-500">No claims yet.</p>
            ) : (
              <ul className="space-y-2">
                {claims.map((c) => (
                  <li key={c.id} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs flex justify-between">
                    <span>{c.title}</span>
                    <span className="rounded border border-[color:var(--wsua-teal)] px-2 py-0.5 text-[color:var(--wsua-teal)]">{c.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
