import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

type TemplateStatus = "active" | "archived";

type Template = {
  name: string;
  version: string;
  status: TemplateStatus;
};

const yourTemplates: Template[] = [
  { name: "WSUA – Standard NDA", version: "v2.4", status: "active" },
  { name: "Vendor onboarding pack", version: "v1.1", status: "active" }
];

const sharedTemplates: Template[] = [
  { name: "Baltic Shipping – Customs", version: "v0.9-draft", status: "active" }
];

const curatedTemplates: Template[] = [
  { name: "WSUA – Gold MSA", version: "v3.2", status: "active" },
  { name: "WSUA – Export control addendum", version: "v1.0", status: "archived" }
];

function TemplateListSection({
  title,
  description,
  templates,
  highlightGold
}: {
  title: string;
  description?: string;
  templates: Template[];
  highlightGold?: boolean;
}) {
  return (
    <Card className="workspace-surface border border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm text-slate-800">
          <span>{title}</span>
          {highlightGold && (
            <span className="rounded-full border border-[color:var(--wsua-gold)] bg-amber-50 px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-[color:var(--wsua-gold)]">
              WSUA-curated
            </span>
          )}
        </CardTitle>
        {description ? (
          <CardDescription>{description}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-2">
        {templates.map((t) => (
          <div
            key={t.name}
            className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs"
          >
            <div>
              <div className="font-medium text-slate-800">{t.name}</div>
              <div className="text-[0.7rem] text-slate-500">
                {t.version}
              </div>
            </div>
            <span
              className={`rounded-full px-2 py-0.5 text-[0.65rem] uppercase tracking-[0.16em] ${
                t.status === "active"
                  ? "border border-[color:var(--wsua-teal)] text-[color:var(--wsua-teal)]"
                  : "border border-slate-300 text-slate-500"
              }`}
            >
              {t.status}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function TemplatesPage() {
  return (
    <div className="flex h-screen flex-col">
      {/* Section header */}
      <header className="charcoal-strip flex items-center justify-between border-b border-[color:var(--charcoal-light)] px-8 py-4">
        <div className="flex flex-col">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Workspace
          </div>
          <div className="mt-1 flex items-baseline gap-4">
            <h1 className="text-lg font-semibold text-slate-50">Templates</h1>
            <span className="h-0.5 w-10 rounded-full bg-[color:var(--wsua-teal)]" />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto px-8 py-6">
        <div className="mx-auto max-w-6xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-wide text-slate-700">
              Template library
            </h2>
            <span className="text-xs text-slate-500">
              Scaffold only – wiring to follow
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <TemplateListSection
              title="Your templates"
              description="Private templates anchored to your WSUA profile."
              templates={yourTemplates}
            />
            <TemplateListSection
              title="Shared templates"
              description="Structures shared with you by your teams."
              templates={sharedTemplates}
            />
          </div>

          <TemplateListSection
            title="WSUA-curated templates"
            description="Gold-standard, centrally managed patterns for high-sensitivity work."
            templates={curatedTemplates}
            highlightGold
          />
        </div>
      </div>
    </div>
  );
}

