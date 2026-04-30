---
title: "Company Lens"
description: "Enrich UK Companies House data with LLM-inferred and verification-backed domain intelligence."
date: "Apr 30 2026"
repoURL: "https://github.com/mattejones/company-lens"
---

Company Lens bridges the gap between a registered UK company and its real-world web presence.

Given a company name or registration number, it queries the Companies House API, runs a two-stage LLM pipeline to infer and verify likely domain names, and produces an auditable, ranked result with full diagnostic data.

## How it works

```
CH API → LLM Inference → Verification → LLM Ranking → Persisted Dataset
```

**Stage 1 — Inference**  
The Companies House profile is sent to an LLM which generates up to 5 candidate domain names, accounting for UK trading name conventions, international brand patterns, SIC industry codes, and company type.

**Stage 2 — Verification**  
Each candidate is checked in parallel across DNS, HTTPS, SSL, WHOIS, and content signals. Redirect chains are followed automatically — if `selcobuilders.co.uk` redirects to `selcobw.com`, the redirect target is promoted to a new candidate and verified in its own right.

**Stage 3 — Ranking**  
A second LLM call re-ranks all verified candidates using explicit decision rules, flagging squatted or parked domains and identifying the canonical primary domain.

Every candidate has a reasoning field, a signal breakdown, and a full audit trail. The goal is explainability — you can see *why* the answer is what it is, not just what it is.

## Why it exists

Most domain enrichment tools are black boxes. Company Lens is different. Every lookup produces a labelled result — making the dataset compound in value over time as a training resource for future projects.

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, Tailwind CSS |
| API | Python 3.12, FastAPI |
| Queue | Celery, Redis |
| Database | PostgreSQL 16 |
| LLM | OpenAI (gpt-4o / o3) or Ollama (self-hosted) |
| Infrastructure | Docker Compose |
