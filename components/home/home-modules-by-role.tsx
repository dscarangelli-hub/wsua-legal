'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  HOME_MODULES_BY_ROLE,
  type UserRoleType,
} from '@/lib/roles/types';

const ROLE_LABELS: Record<UserRoleType, string> = {
  legal_professional: 'Legal Professional',
  ngo_nonprofit: 'NGO / Nonprofit',
  general_user: 'General User',
  ukraine_professional: 'Ukraine-Focused Professional',
};

export function HomeModulesByRole() {
  const [role, setRole] = useState<UserRoleType>('general_user');
  const modules = HOME_MODULES_BY_ROLE[role];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Homepage modules</CardTitle>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as UserRoleType)}
          className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-[var(--wsua-teal)] focus:ring-1 focus:ring-[var(--wsua-teal)]"
        >
          {(Object.keys(ROLE_LABELS) as UserRoleType[]).map((r) => (
            <option key={r} value={r}>
              {ROLE_LABELS[r]}
            </option>
          ))}
        </select>
      </CardHeader>
      <CardContent>
        <p className="mb-3 text-xs text-gray-500">
          Modules shown for: {ROLE_LABELS[role]}
        </p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {modules.map((m) => (
            <li key={m.id}>
              {m.href ? (
                <Link
                  href={m.href}
                  className="block rounded border border-gray-200 p-2 text-sm text-[var(--wsua-teal)] hover:bg-gray-50"
                >
                  {m.label}
                </Link>
              ) : (
                <span className="block rounded border border-gray-200 p-2 text-sm text-gray-600">
                  {m.label}
                </span>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
