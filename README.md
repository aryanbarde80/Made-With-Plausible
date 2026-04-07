# PulseBoard

## 1. What is PulseBoard

PulseBoard is a production-grade, multi-tenant web analytics platform built on top of self-hosted Plausible Analytics. It combines collaborative dashboards, AI insights, plugin extensibility, alerting, reporting, and public APIs into a single SaaS-style workspace. The monorepo is structured for local self-hosting, Render deployment, and future expansion across web, docs, and worker services.

## 2. Architecture diagram

```text
                        +----------------------+
                        |   Browser / Client   |
                        +----------+-----------+
                                   |
                                   v
                     +-------------+--------------+
                     | Next.js Web App (apps/web) |
                     | App Router + tRPC + REST   |
                     +------+------+------+-------+
                            |      |      |
                            |      |      +---------------------+
                            |      |                            |
                            v      v                            v
                   +--------+--+  +----------------+   +------------------+
                   | PostgreSQL |  | Redis / BullMQ |   | Ably Realtime   |
                   +--------+--+  +----------------+   +------------------+
                            |             |                       |
                            v             v                       |
                      +-----+-------------------------+           |
                      | Prisma / DB package           |           |
                      +-------------------------------+           |
                            |                                     |
                            v                                     |
                   +--------+----------------+                    |
                   | Plausible Community Ed. |<-------------------+
                   +--------+----------------+
                            |
                            v
                      +-----+------+
                      | ClickHouse |
                      +------------+

            +--------------------+         +-------------------+
            | Worker (apps/worker)|<------>| Ollama / OpenAI   |
            +--------------------+         +-------------------+
                      |
                      v
            +--------------------+
            | SMTP / Maildev     |
            +--------------------+
```

## 3. Prerequisites

- Node 20
- pnpm 9
- Docker + Docker Compose
- Ably account

## 4. Local setup

```bash
git clone https://github.com/aryanbarde80/Made-With-Plausible.git
cd Made-With-Plausible
pnpm install
cp .env.example .env.local
docker compose up -d
pnpm db:migrate
pnpm db:seed
docker exec ollama ollama pull llama3
pnpm dev
```

Environment variables in `.env.local`:

- `NODE_ENV`: runtime mode.
- `APP_URL`: primary web application URL.
- `DOCS_URL`: docs site URL.
- `NEXTAUTH_URL`: auth callback origin.
- `NEXTAUTH_SECRET`: cookie/session signing secret.
- `SESSION_COOKIE_NAME`: session cookie key.
- `DATABASE_URL`: Prisma connection string.
- `DIRECT_URL`: direct PostgreSQL connection string for Prisma migrations.
- `POSTGRES_DB`: local postgres database name.
- `POSTGRES_USER`: local postgres username.
- `POSTGRES_PASSWORD`: local postgres password.
- `REDIS_URL`: Redis connection string for cache and BullMQ.
- `UPSTASH_REDIS_REST_URL`: optional Upstash-compatible REST URL.
- `UPSTASH_REDIS_REST_TOKEN`: optional Upstash-compatible token.
- `ABLY_API_KEY`: server-side Ably key.
- `ABLY_CLIENT_ID`: default local Ably client identifier.
- `PLAUSIBLE_BASE_URL`: self-hosted Plausible URL.
- `PLAUSIBLE_API_KEY`: Plausible API key.
- `PLAUSIBLE_SECRET_KEY_BASE`: Plausible secret.
- `PLAUSIBLE_SITE_URL`: public Plausible dashboard URL.
- `PLAUSIBLE_CLICKHOUSE_URL`: ClickHouse connection for Plausible.
- `CLICKHOUSE_URL`: direct ClickHouse URL.
- `CLICKHOUSE_USER`: ClickHouse user.
- `CLICKHOUSE_PASSWORD`: ClickHouse password.
- `CLICKHOUSE_DATABASE`: ClickHouse database name.
- `OLLAMA_BASE_URL`: local Ollama host.
- `OLLAMA_MODEL`: model name, default `llama3`.
- `OPENAI_API_KEY`: optional hosted LLM fallback.
- `SMTP_HOST`: mail host.
- `SMTP_PORT`: mail port.
- `SMTP_USER`: SMTP user.
- `SMTP_PASS`: SMTP password.
- `SMTP_FROM`: default sender identity.
- `PUBLIC_APP_NAME`: branding label.
- `PUBLIC_PRIMARY_COLOR`: default accent color.
- `NEXT_PUBLIC_APP_URL`: browser-visible app URL.
- `NEXT_PUBLIC_ABLY_KEY`: client-safe Ably key.
- `PUBLIC_API_RATE_LIMIT_FREE`: free-plan API quota baseline.
- `PUBLIC_API_RATE_LIMIT_PRO`: paid-plan API quota baseline.
- `PUBLIC_DEFAULT_ORG_SLUG`: seeded organization slug.

## 5. Useful dev URLs

- `http://localhost:3000` — web app
- `http://localhost:3001` — email preview / SMTP UI target
- `http://localhost:8001` — Plausible dashboard
- `http://localhost:11434` — Ollama API

## 6. Running tests

```bash
pnpm test
pnpm test:e2e
```

## 7. Deploy to Render

- Use `render.yaml` for the baseline blueprint.
- Provision the PostgreSQL and Redis services declared there.
- Fill in external values for Ably, Plausible, SMTP, and app URLs in the Render dashboard.
- Build the web and worker Docker services from `apps/web/Dockerfile` and `apps/worker/Dockerfile`.

## 8. Plugin development guide

1. Create a plugin bundle with a `plugin.json` manifest matching the schema in `packages/plugin-runtime`.
2. Export widgets, dimensions, or processors from the bundle entrypoint.
3. Install the plugin through the org or superadmin plugin interfaces.
4. Keep plugin permissions explicit so sandboxed execution remains predictable.

## 9. Contributing guide

1. Create a feature branch from `main`.
2. Run `pnpm install`, `pnpm lint`, `pnpm typecheck`, and relevant tests.
3. Keep shared logic in `packages/*` and product-specific UI in `apps/*`.
4. Update docs and env examples when adding new infrastructure or integrations.

