# Deployment Guide

## Production shape

PulseBoard is currently intended to deploy as:

- one Docker web service
- one managed Postgres database
- one managed Redis-compatible key value service
- one separate Ollama deployment
- optional external Plausible and Ably services

Important distinction:

- local development uses Docker Postgres `postgres:16-alpine` and Docker Redis `redis:7-alpine`
- production uses Render Postgres and Render Key Value

## Render strategy

The simplest production path is:

1. Create `pulseboard-db` on Render.
2. Create `pulseboard-redis` on Render.
3. Create `pulseboard-web` as a Docker web service.
4. Point it to `apps/web/Dockerfile`.
5. Add the required env vars.
6. Deploy.

Why this matters:

- do not point production at your local Docker Postgres or Redis
- do not expect the single web container to host Postgres or Redis internally
- the app container connects outward to managed services through env vars

## Docker settings for `pulseboard-web`

- Runtime: Docker
- Branch: `main`
- Dockerfile path: `apps/web/Dockerfile`
- Docker context: `.`
- Region: same region as Postgres and Redis

## Required environment variables

```env
PLAUSIBLE_BASE_URL=
PLAUSIBLE_API_KEY=
ABLY_API_KEY=
NEXT_PUBLIC_ABLY_KEY=
RESEND_API_KEY=
RESEND_FROM=PulseBoard <onboarding@resend.dev>
GROQ_KEY=
DEEPSEEK_KEY=
```

## Managed by Render or repo defaults

These should not need manual setup in the normal path:

- `DATABASE_URL`
- `DIRECT_URL`
- `REDIS_URL`
- `NEXTAUTH_SECRET`
- `NODE_ENV`
- `SESSION_COOKIE_NAME`
- `PUBLIC_DEFAULT_ORG_SLUG`
- `OLLAMA_MODEL`

These are currently hardcoded in source:

- app URL
- Ollama base URL

## Ably setup

When Ably asks which product you want, select:

- `Ably Pub/Sub`

Use the `Root` key.

Format:

```env
ABLY_API_KEY=full.key:value
NEXT_PUBLIC_ABLY_KEY=full.key
```

Do not use the “Subscribe only” key for backend work.

## Plausible setup

PulseBoard expects a running Plausible instance and API key. That can be:

- local Docker Plausible for development
- your own hosted Plausible
- a separately deployed Plausible CE stack

The app consumes analytics from Plausible. It does not replace it.

## Ollama setup

Ollama is expected to be deployed separately. The repo currently points to:

`https://ollama-latest-0kee.onrender.com`

If that changes, update:

- `packages/ai-engine/src/constants.ts`

## Health checks

Use:

- `/api/health`

If you run a free Render web service and need to keep it warm, you can create a cron or external ping against the health endpoint. Paid Render plans usually do not need this.

## Deployment checklist

Before shipping:

1. Confirm Postgres exists and is reachable.
2. Confirm Redis exists and is reachable.
3. Confirm Plausible env values are correct.
4. Confirm Ably Root key is set correctly.
5. Confirm Resend sender is valid.
6. Confirm the Docker web service is using the right Dockerfile.
7. Confirm the deploy logs show both worker and web startup behavior.

## After deploy

Verify these flows first:

- app loads
- registration/login works
- dashboard loads
- health route returns OK
- Plausible-backed analytics requests succeed
- email flow works
- realtime features connect

Those checks catch most first-deploy mistakes.
