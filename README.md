# WSUA Federated Legal Intelligence Platform

Workstation-grade legal intelligence platform with federated legal modules (International, EU, Ukrainian, U.S.), jurisdiction selector with formal confirmation, multilingual ingestion, unified legal graph, versioning & template auto-update, Role Optimization Layer, and Ukraine Reparations & Claims (RD4U/ICCU).

## Stack

- **Next.js 14** (App Router), **TypeScript**, **TailwindCSS**, **Prisma**, **PostgreSQL**
- UI: charcoal base, WSUA teal accents, light workspace surfaces

## Setup

1. **Environment**

   ```bash
   cp .env.example .env
   # Set DATABASE_URL="postgresql://user:password@localhost:5432/wsua_legal"
   ```

2. **Install and database**

   ```bash
   npm install
   npx prisma generate
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

3. **Run**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000). Root redirects to `/home`.

## Routes

| Route | Description |
|-------|-------------|
| `/home` | Home with active vaults, templates/notices, role-based modules |
| `/vaults` | Vault list and create |
| `/crm` | CRM: search, entity explorer, profile, relationships, vault links |
| `/legal` | Legal research: query, jurisdiction selector, confirmation, scenario, research modes |
| `/reparations` | Ukraine Reparations & Claims: RD4U categories, claims, evidence, ICCU framing, packet generator |
| `/templates` | Template library (Your, Shared, WSUA-Curated) |
| `/profile` | User profile (scaffold) |

## API Overview

- **CRM** — `POST /api/crm/person`, `/organization`, `/activity`, `/case`, `/shipment`, `/partner-verification`, `/relationship`; `GET /api/crm/search?q=`, `/api/crm/entity/[id]`, `/api/crm/entity/[id]/relationships`
- **Legal** — `GET /api/legal/jurisdictions`; `POST /api/legal/jurisdiction-selector`, `/jurisdiction-selector/confirm`, `/research`; `GET /api/legal/graph`
- **Graph** — Documents, obligations, relationships, document version, templates, sections, overlays, template version; query layer: documents, obligations, trace, scenario, overlays, search
- **Ingestion** — `POST /api/ingestion` (raw_document, source_metadata)
- **Reparations** — Categories, claims, evidence, claim ICCU framing, claim packet

## Documentation

- `docs/ARCHITECTURE.md` — High-level architecture and layers

## License

Private.
