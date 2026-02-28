'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  FolderOpen,
  Users,
  FileText,
  User,
  Scale,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/vaults', label: 'Vaults', icon: FolderOpen },
  { href: '/crm', label: 'CRM', icon: Users },
  { href: '/legal', label: 'Legal', icon: Scale },
  { href: '/reparations', label: 'Reparations', icon: Shield },
  { href: '/templates', label: 'Templates', icon: FileText },
  { href: '/profile', label: 'Profile', icon: User },
];

export function LeftNav() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-56 flex-col bg-[var(--charcoal)] border-r border-[var(--charcoal-light)]">
      <div className="flex h-12 items-center border-b border-[var(--charcoal-light)] px-4">
        <span className="text-sm font-semibold text-white">WSUA Legal</span>
      </div>
      <nav className="flex-1 space-y-0.5 p-2">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                active
                  ? 'border-l-2 border-[var(--wsua-teal)] bg-[var(--charcoal-light)] text-[var(--wsua-teal-light)]'
                  : 'border-l-2 border-transparent text-gray-400 hover:bg-[var(--charcoal-light)] hover:text-[var(--wsua-teal-light)]'
              )}
            >
              <Icon
                className={cn(
                  'h-5 w-5',
                  active ? 'text-[var(--wsua-teal-light)]' : ''
                )}
              />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
