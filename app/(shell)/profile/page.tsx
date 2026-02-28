import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProfilePage() {
  return (
    <div className="min-h-full p-6">
      <header className="charcoal-strip -mx-6 -mt-6 flex items-center gap-4 px-6 py-4">
        <span className="text-xs uppercase tracking-wider text-gray-400">
          Workspace
        </span>
        <h1 className="text-lg font-semibold text-white">Profile</h1>
        <span className="h-px flex-1 border-b-2 border-[var(--wsua-teal)]" />
      </header>

      <Card className="mt-6 max-w-2xl">
        <CardHeader>
          <CardTitle>WSUA operator profile</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-600">
          Settings, security, and preferences. Scaffolding for future
          implementation.
        </CardContent>
      </Card>
    </div>
  );
}
