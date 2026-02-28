"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

type HomepageModule = { id: string; label: string; href: string; description?: string };

const mockVaults = [
  {
    name: "Acme Corp – Master Services",
    lastOpened: "Today, 09:24",
    collaborators: "Nguyen, Ortiz",
    templateVersion: "WSUA-MSA v3.2",
    active: true
  },
  {
    name: "Baltic Shipping – Compliance Review",
    lastOpened: "Yesterday, 16:02",
    collaborators: "Sharma",
    templateVersion: "Compliance-Deck v1.9",
    active: false
  },
  {
    name: "Northwind Customs – Appeals",
    lastOpened: "Mon, 11:37",
    collaborators: "Solo",
    templateVersion: "Appeals-Pack v2.0",
    active: false
  }
];

export default function HomePage() {
  return (
    <div className="flex h-screen flex-col">
      {/* Header strip */}
      <header className="charcoal-strip flex items-center justify-between border-b border-[color:var(--charcoal-light)] px-8 py-4">
        <div className="flex flex-col">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Workspace
          </div>
          <div className="mt-1 flex items-baseline gap-4">
            <h1 className="text-lg font-semibold text-slate-50">Home</h1>
            <span className="h-0.5 w-10 rounded-full bg-[color:var(--wsua-teal)]" />
          </div>
        </div>
      </header>

      {/* Content grid */}
      <div className="flex-1 overflow-auto px-8 py-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Primary actions */}
          <section className="flex flex-wrap items-center gap-3">
            <Button variant="subtle" size="lg">
              New Vault
            </Button>
            <Button variant="default" size="lg">
              New Template
            </Button>
          </section>

          {/* Main grid: Active Vaults + Templates & Notices */}
          <section className="grid gap-6 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1fr)]">
            {/* Active Vaults */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold tracking-wide text-slate-700">
                  Active vaults
                </h2>
                <span className="text-xs text-slate-500">
                  Last 7 days
                </span>
              </div>
              <div className="space-y-3">
                {mockVaults.map((vault) => (
                  <Card
                    key={vault.name}
                    className="overflow-hidden"
                  >
                    <div className="flex">
                      <div
                        className={
                          vault.active
                            ? "w-1 bg-[color:var(--wsua-teal)]"
                            : "w-1 bg-slate-200"
                        }
                      />
                      <div className="flex-1">
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center justify-between text-sm font-semibold">
                            <span>{vault.name}</span>
                            <span className="text-xs font-medium text-slate-500">
                              {vault.templateVersion}
                            </span>
                          </CardTitle>
                          <CardDescription>
                            <span className="text-xs text-slate-500">
                              Last opened {vault.lastOpened}
                            </span>
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0 pb-3">
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <div className="flex items-center gap-2">
                              <span className="uppercase tracking-[0.16em] text-slate-400">
                                Collaborators
                              </span>
                              <span>{vault.collaborators}</span>
                            </div>
                            {vault.active && (
                              <span className="rounded-full border border-[color:var(--wsua-teal)] px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-[color:var(--wsua-teal)]">
                                Active
                              </span>
                            )}
                          </div>
                        </CardContent>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Right column: Templates & Notices */}
            <div className="space-y-4">
              {/* Templates summary */}
              <Card className="workspace-surface border border-slate-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-slate-800">
                    Templates
                  </CardTitle>
                  <CardDescription>
                    Quick access to your most recent structures.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">Your templates</span>
                    <span className="font-medium text-slate-900">12</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">Shared with you</span>
                    <span className="font-medium text-slate-900">7</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between rounded-md border border-[color:var(--wsua-gold)] bg-amber-50 px-3 py-2 text-xs">
                    <span className="font-medium text-[color:var(--wsua-gold)]">
                      WSUA-curated templates
                    </span>
                    <span className="text-[0.7rem] uppercase tracking-[0.16em] text-amber-700">
                      Gold tier
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Notices */}
              <Card className="workspace-surface border border-slate-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-slate-800">
                    System notices
                  </CardTitle>
                  <CardDescription>
                    Tasks and alerts requiring your attention.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-800">
                        3 vaults pending sign-off
                      </span>
                      <span className="text-[0.7rem] uppercase tracking-[0.16em] text-[color:var(--wsua-teal)]">
                        Today
                      </span>
                    </div>
                    <p className="mt-1 text-slate-600">
                      Review redlines and confirm authority before release.
                    </p>
                  </div>
                  <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-800">
                        Template library update
                      </span>
                      <span className="text-[0.7rem] uppercase tracking-[0.16em] text-slate-500">
                        This week
                      </span>
                    </div>
                    <p className="mt-1 text-slate-600">
                      WSUA-curated MSA and NDA structures refreshed to v3.2.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

