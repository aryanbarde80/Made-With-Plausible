# Development Guide

## First-time setup

From the repo root:

```bash
pnpm install
cp .env.example .env.local
docker compose up -d
pnpm db:migrate
pnpm db:seed
pnpm dev
```

## What runs where

### In local Docker

- Postgres via `postgres:16-alpine`
- Redis via `redis:7-alpine`
- ClickHouse
- Plausible
- Ollama
- Maildev
- optional Celery worker

This repo uses Docker for local stateful infrastructure on purpose:

- local database is Docker Postgres, not a hosted cloud database
- local cache and queue backend is Docker Redis, not Render Key Value
- production swaps those two over to Render-managed services

### In the local Node/Turbo process

- `apps/web`
- `apps/docs`
- `apps/worker`

## Recommended dev workflow

1. Start Docker services.
2. Start the monorepo with `pnpm dev`.
3. Open the app and docs side by side.
4. Make changes in the relevant package or app.
5. Run `pnpm test`, `pnpm typecheck`, and `pnpm build` before shipping.

## Where to make changes

### UI changes

Use:

- `apps/web`
- `packages/ui`

### Data model changes

Use:

- `packages/db/prisma/schema.prisma`

Then run migrations and regenerate the client.

### Analytics integration changes

Use:

- `packages/plausible-sdk`
- `apps/web/server/routers/analytics.ts`

### AI changes

Use:

- `packages/ai-engine`
- `apps/web/server/routers/ai.ts`

LangChain now lives in the AI engine to keep prompt orchestration portable across providers.

### Email changes

Use:

- `packages/email`
- auth and report flows in `apps/web`

### Background task changes

Use:

- `apps/worker`
- `packages/queue`

For Python-native async work, also see:

- `apps/celery-worker`

## Working with Ably

PulseBoard uses Ably Pub/Sub, not Ably Chat or LiveSync.

Use these values:

- `ABLY_API_KEY`: full root key with secret
- `NEXT_PUBLIC_ABLY_KEY`: the key name before the colon

Example:

```env
ABLY_API_KEY=abc123.xyz456:supersecret
NEXT_PUBLIC_ABLY_KEY=abc123.xyz456
```

Why:

- backend needs the full key to publish/manage
- frontend only needs the public key name portion for safe client configuration

## Working with Plausible

Plausible is not optional from a product perspective. It is the analytics source.

When analytics behavior looks wrong, check these first:

- `PLAUSIBLE_BASE_URL`
- `PLAUSIBLE_API_KEY`
- site ids / domain mapping in PostgreSQL
- upstream Plausible availability

## Working with AI

The repo currently points AI traffic to a separate Ollama deployment. That keeps the main app simpler to deploy and cheaper to run.

Cloud fallback order is:

1. Groq for fast general analytics responses
2. DeepSeek for stronger reasoning-style analysis
3. OpenAI as an additional fallback if configured

Why these two were added:

- Groq is useful when you want low-latency “what changed?” style responses
- DeepSeek is useful for more synthesis-heavy prompts like recommendations and trend explanations

Set these env vars when you want cloud fallback beyond Ollama:

```env
GROQ_KEY=
DEEPSEEK_KEY=
```

LangChain is used in those cloud model paths.

Important files:

- `packages/ai-engine/src/constants.ts`
- `apps/web/server/routers/ai.ts`

## Useful commands

```bash
pnpm dev
pnpm test
pnpm typecheck
pnpm build
pnpm db:migrate
pnpm db:seed
```

## Common pitfalls

### “The app starts but analytics looks fake”

Likely causes:

- missing Plausible env
- demo/fallback behavior still active in a route or component

### “Magic links or alerts are not sending”

Likely causes:

- missing `RESEND_API_KEY`
- invalid `RESEND_FROM`

### “Realtime is not updating”

Likely causes:

- wrong Ably key format
- using a restricted key instead of the Root key

### “Build works locally but Render fails”

Likely causes:

- Docker build context mismatch
- missing Render env
- database/redis not attached

## How to think about bugs

When debugging, decide which layer owns the issue:

- product state issue: PostgreSQL / Prisma / server logic
- analytics issue: Plausible / ClickHouse / mapping
- realtime issue: Ably
- AI issue: Ollama / prompt / context injection
- email issue: Resend

That one habit alone will save a lot of time.
