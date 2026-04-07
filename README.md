# PulseBoard

PulseBoard is a multi-tenant analytics workspace built around self-hosted Plausible Analytics. It combines dashboards, realtime collaboration, AI-assisted insights, alerts, reports, plugins, and a public API inside a Turbo monorepo. The repository is structured so local development uses Docker for stateful services, while production deploys cleanly to Render with one Docker web service plus managed Postgres and Redis.

## What this repo includes

- `apps/web`: the main Next.js 14 application
- `apps/docs`: the docs site
- `apps/worker`: background job runtime used from the main container
- `apps/celery-worker`: optional Python Celery sidecar for Python-native async jobs
- `packages/db`: Prisma schema, client, seed, and migrations
- `packages/plausible-sdk`: typed Plausible wrapper
- `packages/ai-engine`: Ollama/OpenAI abstraction used for AI insights
- `packages/plugin-runtime`: plugin manifest and runtime primitives
- `packages/email`: transactional email sender
- `packages/queue`: background queue and job contracts
- `packages/cache`: Redis abstraction and rate-limit helpers
- `packages/ui`: shared UI primitives

## Platform extensions now in the repo

- Sentry instrumentation foundations for frontend, backend, and worker observability
- OpenRouter support for hosted generation and embeddings
- anomaly detection models, routes, and worker jobs
- RAG and vector-search foundations
- warehouse destination and export-run foundations
- SSO configuration and encrypted secret storage foundations

## Architecture

```text
                                       +----------------------+
                                       |      Browsers        |
                                       | Dashboard / API / UI |
                                       +----------+-----------+
                                                  |
                                                  v
                           +----------------------+----------------------+
                           |      PulseBoard Web Service (Docker)        |
                           | apps/web + embedded worker boot process     |
                           | Next.js App Router + tRPC + REST + jobs     |
                           +---------+---------------+--------------------+
                                     |               |
                    +----------------+               +------------------+
                    |                                                   |
                    v                                                   v
        +-----------+-----------+                           +-----------+-----------+
        |   PostgreSQL / Prisma |                           | Redis / BullMQ / Cache|
        | orgs, users, config   |                           | queues, TTLs, limits  |
        +-----------+-----------+                           +-----------+-----------+
                    |                                                   |
                    +--------------------+------------------------------+
                                         |
                                         v
                           +-------------+--------------+
                           |      PulseBoard Domain      |
                           | analytics, alerts, reports  |
                           | AI, plugins, collaboration  |
                           +------+------+------+--------+
                                  |      |      |
                                  |      |      +---------------------------+
                                  |      |                                  |
                                  v      v                                  v
                     +------------+--+  +------------------+      +------------------+
                     | Plausible CE |  | Ably Pub/Sub      |      | Resend           |
                     | analytics API |  | presence/events   |      | magic links/mail |
                     +-------+-------+  +------------------+      +------------------+
                             |
                             v
                       +-----+------+
                       | ClickHouse |
                       | event store |
                       +------------+

                          +------------------------------+
                          | Separate Ollama deployment   |
                          | local/private LLM inference  |
                          +------------------------------+
```

## Why each major service exists

### Why Plausible

PulseBoard does not collect raw analytics itself. Plausible Community Edition is the analytics engine and source of truth for traffic metrics, breakdowns, and realtime visitor counts.

We use Plausible because:

- it is privacy-friendly and self-hostable
- it already solves event ingestion and analytics aggregation well
- it keeps PulseBoard focused on collaboration, product workflows, and SaaS controls instead of rebuilding an analytics backend from scratch

In practice, PulseBoard sits above Plausible and adds:

- organizations and multi-tenancy
- collaborative dashboards
- saved filters and annotations
- alerts and scheduled reports
- AI summarization over analytics context
- plugin-based extensions

### Why Ably

Ably powers the live collaboration layer. PulseBoard needs fast fan-out for events like “someone joined this dashboard”, “an annotation was added”, or “a dashboard edit happened”.

We use Ably Pub/Sub because:

- it fits presence and broadcast style collaboration
- it is simpler than building our own websocket layer
- it scales better than keeping all realtime state inside the Next.js process

Ably is intended for:

- teammate presence on the same site
- live annotations
- dashboard edit broadcasts
- alert acknowledgement sync

### Why Redis

Redis has three jobs in this project:

- short-lived cache for analytics responses
- job backend for worker tasks
- rate limiting state for API and internal routes

Without Redis, the app would be slower, job processing would be unreliable, and request throttling would be much harder to implement safely.

Concrete infrastructure:

- local development uses Docker Redis with `redis:7-alpine`
- production uses Render Key Value as the Redis-compatible managed service

### Why PostgreSQL

PostgreSQL stores the SaaS product state that Plausible does not know about:

- users and sessions
- organizations and memberships
- sites and settings
- dashboards and widgets
- alerts, reports, invites, API keys
- AI insight history
- plugin installations

Think of it this way:

- Plausible stores analytics events and aggregates
- PostgreSQL stores PulseBoard product data

Concrete infrastructure:

- local development uses Docker Postgres with `postgres:16-alpine`
- production uses Render Postgres as the managed database

### Why Ollama

Ollama runs local or self-hosted LLM inference for AI insights. It lets the product explain trends, suggest optimizations, and summarize current site performance using real analytics context.

In this repo, Ollama is intentionally deployed separately so the main web service stays simpler and cheaper to operate.

### Why LangChain

LangChain is used inside the AI engine to standardize prompt templates and cloud-model orchestration across Groq, DeepSeek, and OpenAI.

### Why OpenRouter

OpenRouter gives PulseBoard a provider-agnostic cloud model layer for hosted generation and embeddings. It works well here because PulseBoard needs flexibility between local inference, low-latency hosted inference, and semantic retrieval without rewriting the AI engine each time.

### Why Sentry

Sentry gives the app and worker a real observability layer. That matters because the product spans auth, AI, analytics, Redis, email, exports, and collaboration, and those systems become hard to operate safely without centralized error tracking.

### Why Celery

Celery is included as an optional Python sidecar for background work that benefits from the Python ecosystem.

Examples:

- enrichment pipelines
- document processing
- ETL jobs
- offline AI preprocessing

### Why Resend

Resend handles transactional email:

- magic links
- invites
- developer snippet emails
- alerts
- reports

It replaced the older SMTP-heavy setup so deployment is easier for a single-developer workflow.

## Current deployment model

The repository currently targets this production shape:

- `1` Docker web service on Render for the main app
- `1` managed Render Postgres database
- `1` managed Render Key Value instance for Redis-compatible features
- `1` separate Ollama deployment
- optional `1` Celery sidecar for Python-native background jobs
- optional external Plausible and Ably accounts

The web service starts both:

- the Next.js application
- the background worker loop

This is done through [`apps/web/start.sh`](/C:/Users/aryan/OneDrive/Documents/New%20project%202/Made-With-Plausible/apps/web/start.sh).

## Monorepo layout

```text
.
|-- apps
|   |-- web
|   |-- docs
|   `-- worker
|-- packages
|   |-- ai-engine
|   |-- cache
|   |-- config
|   |-- db
|   |-- email
|   |-- plausible-sdk
|   |-- plugin-runtime
|   |-- queue
|   |-- types
|   `-- ui
|-- tests
|-- docs
|-- render.yaml
|-- docker-compose.yml
`-- .env.example
```

## Product feature map

### Core product areas

- Multi-tenant organizations
- Site management and verification workflows
- Analytics dashboards backed by Plausible
- Realtime collaboration with Ably
- AI insight workflows
- Alerts and scheduled reports
- Plugin runtime and marketplace foundation
- Public REST API and internal tRPC API
- observability, vector search, export, and enterprise-ready extension foundations

### Main route groups

- `(marketing)`: landing and public-facing pages
- `(auth)`: register, login, verification, 2FA-related flows
- `(app)`: authenticated workspace
- `api/trpc`: internal typed RPC surface
- `api/v1`: external REST API

## Local development

### Prerequisites

- Node.js `20+`
- `pnpm` `9+`
- Docker Desktop
- Git

Optional but recommended:

- Ably account
- Plausible Community Edition running locally or remotely
- Resend account

### Setup

```bash
git clone https://github.com/aryanbarde80/Made-With-Plausible.git
cd Made-With-Plausible
pnpm install
cp .env.example .env.local
docker compose up -d
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Local Docker services from [`docker-compose.yml`](/C:/Users/aryan/OneDrive/Documents/New%20project%202/Made-With-Plausible/docker-compose.yml):

- PostgreSQL: `postgres:16-alpine`
- Redis: `redis:7-alpine`
- ClickHouse: `clickhouse/clickhouse-server:24.3`
- Plausible CE: `ghcr.io/plausible/community-edition:v2.1.4`
- Ollama: `ollama/ollama:latest`
- Maildev: `maildev/maildev`
- Celery worker: Python `3.11` sidecar in `apps/celery-worker`

If you want local Ollama:

```bash
docker exec ollama ollama pull llama3
```

### Useful local URLs

- `http://localhost:3000` - main app
- `http://localhost:3002` - docs app
- `http://localhost:8001` - Plausible dashboard
- `http://localhost:11434` - Ollama API
- `http://localhost:1080` - Maildev UI if using local mail preview

## Environment variables

The full development template lives in [`.env.example`](/C:/Users/aryan/OneDrive/Documents/New%20project%202/Made-With-Plausible/.env.example).

### Core runtime

- `NODE_ENV`: runtime mode
- `DOCS_URL`: docs site origin
- `NEXTAUTH_SECRET`: session signing secret
- `SESSION_COOKIE_NAME`: app session cookie name

### Database

- `DATABASE_URL`: Prisma application connection string
- `DIRECT_URL`: direct connection string for migrations and admin tasks
- `POSTGRES_DB`: local Docker database name
- `POSTGRES_USER`: local Docker database user
- `POSTGRES_PASSWORD`: local Docker database password

### Redis and cache

- `REDIS_URL`: Redis connection
- `UPSTASH_REDIS_REST_URL`: optional REST-style Redis endpoint
- `UPSTASH_REDIS_REST_TOKEN`: optional REST token

### Analytics

- `PLAUSIBLE_BASE_URL`: base URL of the Plausible instance
- `PLAUSIBLE_API_KEY`: Plausible API key
- `PLAUSIBLE_SECRET_KEY_BASE`: local Plausible secret
- `PLAUSIBLE_SITE_URL`: public Plausible dashboard URL
- `PLAUSIBLE_CLICKHOUSE_URL`: Plausible-to-ClickHouse URL

### ClickHouse

- `CLICKHOUSE_URL`
- `CLICKHOUSE_USER`
- `CLICKHOUSE_PASSWORD`
- `CLICKHOUSE_DATABASE`

### AI

- `OLLAMA_BASE_URL`: local/self-hosted Ollama base URL for local dev
- `OLLAMA_MODEL`: model name
- `CELERY_BROKER_URL`: optional Celery broker URL
- `CELERY_RESULT_BACKEND`: optional Celery result backend
- `OPENROUTER_API_KEY`: OpenRouter key for hosted generation and embeddings
- `OPENROUTER_MODEL`: default OpenRouter generation model
- `OPENROUTER_EMBEDDING_MODEL`: default OpenRouter embedding model
- `GROQ_KEY`: Groq API key for fast cloud inference fallback
- `GROQ_MODEL`: Groq model override
- `DEEPSEEK_KEY`: DeepSeek API key for reasoning-oriented cloud fallback
- `DEEPSEEK_MODEL`: DeepSeek model override
- `OPENAI_API_KEY`: optional hosted fallback

### Observability

- `SENTRY_DSN`
- `NEXT_PUBLIC_SENTRY_DSN`
- `SENTRY_AUTH_TOKEN`
- `SENTRY_ORG`
- `SENTRY_PROJECT`

### Email

- `RESEND_API_KEY`: Resend server key
- `RESEND_FROM`: default sender identity

### Realtime

- `ABLY_API_KEY`: full Ably server key with secret
- `ABLY_CLIENT_ID`: default local client id
- `NEXT_PUBLIC_ABLY_KEY`: Ably key name safe for frontend config

### Public config

- `PUBLIC_APP_NAME`
- `PUBLIC_PRIMARY_COLOR`
- `PUBLIC_API_RATE_LIMIT_FREE`
- `PUBLIC_API_RATE_LIMIT_PRO`
- `PUBLIC_DEFAULT_ORG_SLUG`

## Render deployment

### Recommended production topology

- `pulseboard-web`: Docker web service
- `pulseboard-db`: Render Postgres managed database
- `pulseboard-redis`: Render Key Value managed Redis-compatible store
- `ollama-latest-0kee`: separate Ollama service

### What is already hardcoded in the repo

The current codebase hardcodes:

- app base URL as `https://pulseboard-web.onrender.com`
- Ollama base URL as `https://ollama-latest-0kee.onrender.com`

AI provider order currently is:

1. Ollama
2. Groq
3. DeepSeek
4. OpenRouter
5. OpenAI
6. built-in fallback summary

Those values currently live in:

- [`apps/web/lib/constants.ts`](/C:/Users/aryan/OneDrive/Documents/New%20project%202/Made-With-Plausible/apps/web/lib/constants.ts)
- [`packages/ai-engine/src/constants.ts`](/C:/Users/aryan/OneDrive/Documents/New%20project%202/Made-With-Plausible/packages/ai-engine/src/constants.ts)

### Minimum env values to add on Render

```env
PLAUSIBLE_BASE_URL=
PLAUSIBLE_API_KEY=
ABLY_API_KEY=
NEXT_PUBLIC_ABLY_KEY=
RESEND_API_KEY=
RESEND_FROM=PulseBoard <onboarding@resend.dev>
OPENROUTER_API_KEY=
GROQ_KEY=
DEEPSEEK_KEY=
SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=
```

Render-managed values come from [`render.yaml`](/C:/Users/aryan/OneDrive/Documents/New%20project%202/Made-With-Plausible/render.yaml):

- `DATABASE_URL`
- `DIRECT_URL`
- `REDIS_URL`
- `NEXTAUTH_SECRET`
- `NODE_ENV`
- `SESSION_COOKIE_NAME`
- `PUBLIC_DEFAULT_ORG_SLUG`
- `OLLAMA_MODEL`

### Deploy steps

1. Create Render Postgres as `pulseboard-db`.
2. Create Render Key Value as `pulseboard-redis`.
3. Create a Docker web service from this repo using [`apps/web/Dockerfile`](/C:/Users/aryan/OneDrive/Documents/New%20project%202/Made-With-Plausible/apps/web/Dockerfile).
4. Attach the database and key-value env vars.
5. Add Plausible, Ably, and Resend env values.
6. Deploy.

## Developer mental model

When a new developer opens this repo, the easiest way to reason about it is:

1. Plausible is the analytics engine.
2. PostgreSQL is the PulseBoard product database.
   Locally this is Docker `postgres:16-alpine`; in production this is Render Postgres.
3. Redis supports cache, jobs, and rate limits.
   Locally this is Docker `redis:7-alpine`; in production this is Render Key Value.
4. The web service hosts the Next app and starts the worker.
5. Ably adds collaboration.
6. Ollama, LangChain, and OpenRouter power AI orchestration.
7. Sentry gives cross-runtime observability.
8. Celery is available for Python-native async jobs.
9. Resend handles email.

If you keep that mental split in mind, the repo becomes much easier to navigate.

## Testing

Run the main verification commands from the repo root:

```bash
pnpm test
pnpm typecheck
pnpm build
pnpm test:e2e
```

## Additional documentation

- [Architecture Guide](./docs/ARCHITECTURE.md)
- [Development Guide](./docs/DEVELOPMENT.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Operations Guide](./docs/OPERATIONS.md)
- [Platform Roadmap](./docs/PLATFORM-ROADMAP.md)

## Honest status

This repository is much stronger than a starter scaffold, but some advanced areas are still intentionally simplified compared with the original platform vision.

Examples:

- some integrations still have fallback behavior
- the worker shares a container with the web app in production
- parts of the live collaboration and plugin ecosystem are foundation-first, not fully mature marketplace flows yet

The documentation here describes the repo as it actually exists today, not as a future wishlist.
