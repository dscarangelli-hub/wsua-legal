import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HomeModulesByRole } from '@/components/home/home-modules-by-role';

export default function HomePage() {
  return (
    <div className="min-h-full p-6">
      <header className="charcoal-strip -mx-6 -mt-6 flex items-center gap-4 px-6 py-4">
        <span className="text-xs uppercase tracking-wider text-gray-400">
          Workspace
        </span>
        <h1 className="text-lg font-semibold text-white">Home</h1>
        <span className="h-px flex-1 border-b-2 border-[var(--wsua-teal)]" />
      </header>

      <div className="mt-6 flex gap-3">
        <Button variant="subtle">New Vault</Button>
        <Button variant="default">New Template</Button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1fr)]">
        <div>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Active Vaults
          </h2>
          <div className="space-y-3">
            <Card className="border-l-4 border-l-[var(--wsua-teal)]">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>Sample Vault</CardTitle>
                  <span className="rounded border border-[var(--wsua-teal)] px-2 py-0.5 text-xs text-[var(--wsua-teal)]">
                    Active
                  </span>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                <p>Last opened: Today</p>
                <p>Collaborators: 2</p>
                <p>Template version: 1.2</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-slate-300">
              <CardHeader className="pb-2">
                <CardTitle>Archived Vault</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                <p>Last opened: 1 week ago</p>
                <p>Template version: 1.0</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Templates & Notices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-gray-600">Your templates</p>
              <p className="text-gray-600">Shared with you</p>
              <p className="flex items-center gap-2">
                <span className="rounded border border-[var(--wsua-gold)] bg-amber-50 px-2 py-0.5 text-xs text-[var(--wsua-gold)]">
                  WSUA-Curated
                </span>
                Gold tier
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>System notices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-gray-600">
              <p>• Vaults pending sign-off</p>
              <p>• Template library update</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <section className="mt-10">
        <HomeModulesByRole />
      </section>
    </div>
  );
}
