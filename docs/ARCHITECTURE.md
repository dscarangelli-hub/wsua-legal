# WSUA Federated Legal Intelligence Platform — Architecture

## Overview

The platform is a federated, multilingual legal-intelligence system integrating:

- **International law** (UN, ICJ/ICC, ECHR, IHL)
- **EU law** (TEU/TFEU, Regulations, Directives, CJEU)
- **Ukrainian law** (national, oblast, city)
- **U.S. law** (federal, circuit, state)
- **NGO/Nonprofit operational templates** (curated, auto-updating)
- **Ukraine Reparations & Claims** (RD4U, ICCU framing, evidence, claim packets)

## Layers

1. **User interaction** — Query interface, Jurisdiction Selector, Scenario Selector
2. **Multilingual ingestion** — Language detection, translation to normalized English, sentence alignment, metadata
3. **Federated legal modules** — International, EU, Ukraine, U.S. (each with own ingestion and update rhythm)
4. **Unified legal graph** — Nodes (documents, obligations, templates), edges (implements, amends, cites, supersedes, etc.), versioning, deltas
5. **Versioning & update orchestration** — Per-module update schedules, delta computation, graph and template updates, audit
6. **NGO/Template module** — Template object model, overlays, automatic template update engine, scenario guidance
7. **Research assistant** — Summaries, obligations, compliance, comparison, conflict detection, template recommendations (non-advisory)

## Role Optimization

- **legal_professional** — Legal Research Console, Jurisdiction Selector, Obligations, Reparations & ICCU, Document Vault
- **ngo_nonprofit** — Templates, Scenario Guidance, Grant Readiness, Humanitarian Access, RD4U Claim Builder, Evidence Uploader
- **general_user** — Summaries, Ukraine Overview, Public Templates, Basic Legal
- **ukraine_professional** — Reparations & Claims, ICCU Framing, RD4U Packet Generator, Ukrainian Law, Oblast/City, Humanitarian Access

## CRM Integration

CRM is the graph-based institutional layer: People, Organizations, Activities, Documents, Cases, Shipments, Partner Verifications, with relationships and vault links. All modules can link to CRM entities; the legal graph is the CRM’s authoritative knowledge base for legal documents and template overlays.

## Key APIs

- **Jurisdiction selector** — `POST /api/legal/jurisdiction-selector`, `POST /api/legal/jurisdiction-selector/confirm`
- **Graph ingestion** — `POST /api/graph/documents`, `POST /api/graph/obligations`, `POST /api/graph/relationships`, `POST /api/graph/documents/[id]/version`
- **Template engine** — `GET /api/graph/templates/[id]`, `GET /api/graph/templates/[id]/sections`, `PATCH /api/graph/overlays/[id]`, `POST /api/graph/templates/[id]/version`
- **Query layer** — `GET /api/graph/query/documents/[id]`, `GET /api/graph/query/obligations`, `GET /api/graph/query/templates/scenario/[tag]`, etc.
- **Ingestion** — `POST /api/ingestion`
- **Reparations** — `GET/POST /api/reparations/categories`, `GET/POST /api/reparations/claims`, `POST /api/reparations/evidence`, `GET/POST /api/reparations/claims/[id]/iccu-framing`, `POST /api/reparations/claims/[id]/packet`
