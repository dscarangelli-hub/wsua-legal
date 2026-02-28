import { LeftNav } from '@/components/layout/left-nav';

export default function ShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <LeftNav />
      <main className="flex-1 overflow-auto workspace-surface">{children}</main>
    </div>
  );
}
