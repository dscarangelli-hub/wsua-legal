import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function VaultsPage() {
  return (
    <div className="min-h-full p-6">
      <header className="charcoal-strip -mx-6 -mt-6 flex items-center gap-4 px-6 py-4">
        <span className="text-xs uppercase tracking-wider text-gray-400">
          Workspace
        </span>
        <h1 className="text-lg font-semibold text-white">Vaults</h1>
        <span className="h-px flex-1 border-b-2 border-[var(--wsua-teal)]" />
      </header>

      <div className="mt-6 flex gap-4">
        <aside className="hidden w-48 flex-shrink-0 rounded bg-[var(--charcoal)] p-3 md:block">
          <p className="text-xs font-semibold uppercase text-gray-400">
            My vaults
          </p>
          <p className="text-xs text-gray-500">Team</p>
          <p className="text-xs text-gray-500">Archived</p>
        </aside>
        <div className="flex-1">
          <Button variant="subtle" className="mb-4">
            Create Vault
          </Button>
          <div className="space-y-3">
            <Card className="border-l-4 border-l-[var(--charcoal-light)]">
              <CardHeader className="pb-2">
                <CardTitle>Placeholder Vault</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                <p>Owner: System</p>
                <p>Matters: 0</p>
                <span className="mt-2 inline-block rounded border border-[var(--wsua-teal)] px-2 py-0.5 text-xs text-[var(--wsua-teal)]">
                  Structured
                </span>
              </CardContent>
            </Card>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Placeholder list – internals to follow
          </p>
        </div>
      </div>
    </div>
  );
}
