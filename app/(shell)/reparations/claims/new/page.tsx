'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function NewClaimPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [narrative, setNarrative] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/reparations/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          narrative,
          rd4uCategoryId: categoryId || undefined,
          status: 'draft',
        }),
      });
      const data = await res.json();
      if (data.id) router.push(`/reparations/claims/${data.id}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl p-6">
      <h1 className="text-lg font-semibold text-gray-900">New RD4U claim</h1>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Claim details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-[var(--wsua-teal)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600">
                RD4U category ID (optional)
              </label>
              <input
                type="text"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-[var(--wsua-teal)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600">
                Narrative
              </label>
              <textarea
                value={narrative}
                onChange={(e) => setNarrative(e.target.value)}
                rows={4}
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-[var(--wsua-teal)]"
              />
            </div>
            <Button type="submit" variant="subtle" disabled={submitting}>
              {submitting ? 'Creating…' : 'Create claim'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
