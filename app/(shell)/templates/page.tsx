import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TemplatesPage() {
  return (
    <div className="min-h-full p-6">
      <header className="charcoal-strip -mx-6 -mt-6 flex items-center gap-4 px-6 py-4">
        <span className="text-xs uppercase tracking-wider text-gray-400">
          Workspace
        </span>
        <h1 className="text-lg font-semibold text-white">Templates</h1>
        <span className="h-px flex-1 border-b-2 border-[var(--wsua-teal)]" />
      </header>

      <p className="mt-4 text-sm text-gray-600">Template library</p>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Your templates</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600">
            <ul className="space-y-1">
              <li>Private Template v1.0 — Active</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Shared templates</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600">
            Templates shared with you
          </CardContent>
        </Card>
        <Card className="border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              WSUA-curated templates
              <span className="rounded border border-[var(--wsua-gold)] bg-amber-50 px-2 py-0.5 text-xs text-[var(--wsua-gold)]">
                WSUA-curated
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600">
            Curated patterns and forms
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
