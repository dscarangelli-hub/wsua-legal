import type { ReactNode } from "react";
import { LeftNav } from "@/components/layout/left-nav";

export default function ShellLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f5f5f7] text-slate-900">
      <LeftNav />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}

