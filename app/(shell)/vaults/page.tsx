import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

const vaults = [
  {
    name: "Acme Corp – Master Services",
    matters: 12,
    owner: "Nguyen",
    lastActivity: "Today, 09:24"
  },
  {
    name: "Baltic Shipping – Compliance",
    matters: 6,
    owner: "Sharma",
    lastActivity: "Yesterday, 16:02"
  }
];

export default function VaultsPage() {
  return (
    <div className="flex h-screen flex-col">
      {/* Section header */}
      <header className="charcoal-strip flex items-center justify-between border-b border-[color:var(--charcoal-light)] px-8 py-4">
        <div className="flex flex-col">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Workspace
          </div>
          <div className="mt-1 flex items-baseline gap-4">
            <h1 className="text-lg font-semibold text-slate-50">Vaults</h1>
            <span className="h-0.5 w-10 rounded-full bg-[color:var(--wsua-teal)]" />
          </div>
        </div>
        <Button variant="subtle" size="lg">
          Create Vault
        </Button>
      </header>

      {/* Vault list */}
      <div className="flex-1 overflow-auto px-8 py-6">
        <div className="mx-auto flex max-w-6xl gap-6">
          <aside className="hidden w-64 flex-shrink-0 flex-col rounded-lg border border-[color:var(--charcoal-light)] bg-[color:var(--charcoal)] px-4 py-4 text-xs text-slate-200 md:flex">
            <div className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Filters
            </div>
            <div className="space-y-2 text-slate-300">
              <div className="flex items-center justify-between">
                <span>My vaults</span>
                <span className="rounded-full bg-[color:var(--charcoal-light)] px-2 py-0.5 text-[0.65rem]">
                  8
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Team</span>
                <span className="rounded-full bg-[color:var(--charcoal-light)] px-2 py-0.5 text-[0.65rem]">
                  14
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Archived</span>
                <span className="rounded-full bg-[color:var(--charcoal-light)] px-2 py-0.5 text-[0.65rem]">
                  3
                </span>
              </div>
            </div>
          </aside>

          <section className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-wide text-slate-700">
                Vault catalog
              </h2>
              <span className="text-xs text-slate-500">
                Placeholder list – internals to follow
              </span>
            </div>
            <div className="space-y-3">
              {vaults.map((vault) => (
                <Card key={vault.name} className="overflow-hidden">
                  <div className="flex">
                    <div className="w-1 bg-[color:var(--charcoal-light)]" />
                    <div className="flex-1">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold">
                          {vault.name}
                        </CardTitle>
                        <CardDescription>
                          <span className="text-xs text-slate-500">
                            Owner {vault.owner} · Last activity {vault.lastActivity}
                          </span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0 pb-3">
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>{vault.matters} active matters</span>
                          <span className="rounded-full border border-[color:var(--wsua-teal)] px-2 py-0.5 text-[0.65rem] uppercase tracking-[0.16em] text-[color:var(--wsua-teal)]">
                            Structured
                          </span>
                        </div>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

