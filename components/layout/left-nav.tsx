\"use client\";

import Link from \"next/link\";
import { usePathname } from \"next/navigation\";
import { cn } from \"@/lib/utils\";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const items: NavItem[] = [
  {
    label: \"Home\",
    href: \"/home\",
    icon: (
      <span className=\"h-4 w-4 rounded-sm border border-slate-500\" aria-hidden=\"true\" />
    )
  },
  {
    label: \"Vaults\",
    href: \"/vaults\",
    icon: (
      <span className=\"h-4 w-4 rounded-sm border border-slate-500\" aria-hidden=\"true\" />
    )
  },
  {
    label: \"CRM\",
    href: \"/crm\",
    icon: (
      <span className=\"h-4 w-4 rounded-sm border border-slate-500\" aria-hidden=\"true\" />
    )
  },
  {
    label: \"Templates\",
    href: \"/templates\",
    icon: (
      <span className=\"h-4 w-4 rounded-sm border border-slate-500\" aria-hidden=\"true\" />
    )
  },
  {
    label: \"Legal\",
    href: \"/legal\",
    icon: (
      <span className=\"h-4 w-4 rounded-sm border border-slate-500\" aria-hidden=\"true\" />
    )
  },
  {
    label: \"Reparations\",
    href: \"/reparations\",
    icon: (
      <span className=\"h-4 w-4 rounded-sm border border-slate-500\" aria-hidden=\"true\" />
    )
  },
  {
    label: \"Profile\",
    href: \"/profile\",
    icon: (
      <span className=\"h-4 w-4 rounded-full border border-slate-500\" aria-hidden=\"true\" />
    )
  }
];

export function LeftNav() {
  const pathname = usePathname();

  return (
    <aside className=\"flex h-screen w-60 flex-col bg-[color:var(--charcoal)] text-slate-200\">
      <div className=\"flex h-16 items-center px-5 text-sm font-semibold tracking-[0.12em] uppercase text-slate-200 border-b border-[color:var(--charcoal-light)]\">
        <span className=\"mr-2 h-6 w-1 rounded-full bg-[color:var(--wsua-teal)]\" aria-hidden=\"true\" />
        WSUA Legal
      </div>
      <nav className=\"flex-1 py-4\">
        <ul className=\"space-y-1\">
          {items.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    \"group flex items-center gap-3 px-4 py-2 text-sm transition-colors relative\",
                    active
                      ? \"text-white bg-[color:var(--charcoal-light)]\"
                      : \"text-slate-400 hover:text-slate-100 hover:bg-[color:var(--charcoal-light)]\"
                  )}
                >
                  <span
                    className={cn(
                      \"absolute inset-y-0 left-0 w-0.5 rounded-r-full bg-transparent transition-colors\",
                      active && \"bg-[color:var(--wsua-teal)]\"
                    )}
                    aria-hidden=\"true\"
                  />
                  <span
                    className={cn(
                      \"flex h-7 w-7 items-center justify-center rounded-md border border-transparent\",
                      active
                        ? \"text-[color:var(--wsua-teal)] bg-[color:var(--charcoal)] border-[color:var(--wsua-teal)]\"
                        : \"text-slate-400 group-hover:text-[color:var(--wsua-teal)]\"
                    )}
                  >
                    {item.icon}
                  </span>
                  <span className=\"truncate\">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

