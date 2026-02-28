'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ClaimDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [claim, setClaim] = useState<Record<string, unknown> | null>(null);
  const [framing, setFraming] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/reparations/claims/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setClaim(data))
      .catch(() => setClaim(null));
  }, [id]);

  const generateICCU = async () => {
    const res = await fetch(`/api/reparations/claims/${id}/iccu-framing`, {
      method: 'POST',
    });
    const data = await res.json();
    setFraming(data);
  };

  const generatePacket = async () => {
    const res = await fetch(`/api/reparations/claims/${id}/packet`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ format: 'json', locale: 'en' }),
    });
    const data = await res.json();
    alert('Packet: ' + JSON.stringify(data, null, 2));
  };

  return (
    <div className="max-w-3xl p-6">
      <div className="mb-4 flex items-center gap-2">
        <Link href="/reparations" className="text-sm text-[var(--wsua-teal)]">
          ← Reparations
        </Link>
      </div>
      <h1 className="text-lg font-semibold text-gray-900">
        {claim ? String(claim.title) : 'Claim'}
      </h1>
      {claim && (
        <div className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600">
              <p>Status: {String(claim.status)}</p>
              <p>Narrative: {String(claim.narrative ?? '')}</p>
            </CardContent>
          </Card>
          <div className="flex gap-2">
            <Button variant="default" onClick={generateICCU}>
              Generate ICCU framing
            </Button>
            <Button variant="subtle" onClick={generatePacket}>
              Generate RD4U packet (JSON)
            </Button>
          </div>
          {framing && (
            <Card>
              <CardHeader>
                <CardTitle>ICCU legal framing</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="overflow-auto text-xs">
                  {JSON.stringify(framing, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
