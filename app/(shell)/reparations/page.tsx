'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ReparationsPage() {
  const [categories, setCategories] = useState<Array<{ categoryId: string; title: string }>>([]);
  const [claims, setClaims] = useState<Array<{ id: string; title: string; status: string }>>([]);

  useEffect(() => {
    fetch('/api/reparations/categories')
      .then((r) => r.json())
      .then(setCategories);
    fetch('/api/reparations/claims')
      .then((r) => r.json())
      .then(setClaims);
  }, []);

  return (
    <div className="min-h-full p-6">
      <header className="charcoal-strip -mx-6 -mt-6 flex items-center gap-4 px-6 py-4">
        <span className="text-xs uppercase tracking-wider text-gray-400">
          Workspace
        </span>
        <h1 className="text-lg font-semibold text-white">
          Ukraine Reparations & Claims
        </h1>
        <span className="h-px flex-1 border-b-2 border-[var(--wsua-teal)]" />
      </header>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>RD4U Claim Builder</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600">
            <p>Start RD4U claim, upload evidence, classify harm, generate packet.</p>
            <Button variant="default" asChild>
              <Link href="/reparations/claims/new">Start RD4U claim</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Evidence uploader</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600">
            Upload photos, videos, documents, testimonies. Chain-of-custody and
            RD4U category classification.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>ICCU legal framing</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600">
            Map harms to international law (IHL, human rights, aggression).
            Ukrainian and EU law links. Structured, exportable output.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Compensation readiness</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600">
            Claim status, eligibility metadata, payment readiness indicators.
          </CardContent>
        </Card>
      </div>

      <section className="mt-8">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
          RD4U categories
        </h2>
        <ul className="flex flex-wrap gap-2">
          {categories.length === 0 && (
            <li className="rounded border border-gray-200 px-3 py-1 text-sm text-gray-500">
              No categories yet. Seed or create via API.
            </li>
          )}
          {categories.map((c) => (
            <li
              key={c.categoryId}
              className="rounded border border-[var(--wsua-teal)] px-3 py-1 text-sm text-[var(--wsua-teal)]"
            >
              {c.title} ({c.categoryId})
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
          Claims
        </h2>
        <ul className="space-y-2">
          {claims.length === 0 && (
            <li className="text-sm text-gray-500">No claims yet.</li>
          )}
          {claims.map((c) => (
            <li key={c.id} className="flex items-center gap-2">
              <span className="font-medium">{c.title}</span>
              <span className="rounded border border-gray-300 px-2 py-0.5 text-xs">
                {c.status}
              </span>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/reparations/claims/${c.id}`}>View</Link>
              </Button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
