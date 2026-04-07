# Architecture Guide

## Overview

PulseBoard is split into two broad layers:

- the analytics data layer
- the SaaS product layer

The analytics data layer is powered by Plausible and ClickHouse.
The SaaS product layer is powered by Next.js, Prisma, PostgreSQL, Redis, Ably, Resend, and Ollama.

Concrete infrastructure split:

- local Postgres uses Docker `postgres:16-alpine`
- production Postgres uses Render Postgres
- local Redis uses Docker `redis:7-alpine`
- production Redis uses Render Key Value

That distinction matters because it explains most of the codebase.

## Layer 1: Analytics data layer

Plausible Community Edition is responsible for:

- collecting pageview and custom event traffic
- aggregating metrics
- serving analytics queries
- exposing realtime and reporting APIs

ClickHouse sits under Plausible and stores the high-volume event data.

PulseBoard does not replace this layer. It consumes it.

## Layer 2: Product layer

PulseBoard adds product features around Plausible:

- identity and sessions
- organizations and roles
- multi-site grouping
- annotations and saved filters
- collaborative dashboards
- AI-assisted analysis
- alerting and reporting
- API keys
- plugin installation and configuration

This layer lives mostly in:

- `apps/web`
- `apps/worker`
- `packages/*`
- PostgreSQL

## Request flow

### Browser to dashboard

1. User opens the Next.js app.
2. Session and org context are resolved.
3. UI calls internal tRPC procedures or REST endpoints.
4. Server code reads product data from PostgreSQL.
5. For analytics panels, server code calls Plausible via `packages/plausible-sdk`.
6. Results may be cached in Redis.
7. Response returns to the UI.

## Realtime flow

Ably is the collaboration transport.

Typical flow:

1. User opens a site dashboard.
2. Client joins a site-scoped Ably channel.
3. Presence and event messages are broadcast to viewers.
4. Other viewers update without page refresh.

This is intended for:

- presence
- annotations
- dashboard edit sync
- alert acknowledgement sync

## AI flow

1. User asks a question in the AI panel.
2. Server collects current site context.
3. Context is passed to the AI engine.
4. AI engine calls Ollama by default.
5. Response is persisted and rendered back to the user.

The key architectural rule is that the model should reason over real analytics context, not generic guesses.

## Background work

The worker runtime is packaged separately in `apps/worker`, but production currently starts it from the same container as the web app.

Background responsibilities include:

- alert evaluation
- site verification loops
- AI context warming
- scheduled reports

This is a pragmatic deployment choice that reduces Render complexity for a single-service app deployment.

## Package responsibilities

### `packages/db`

- Prisma schema
- generated client
- migrations
- seed helpers

### `packages/plausible-sdk`

- typed Plausible client
- validation around request/response shapes
- a single place for Plausible integration behavior

### `packages/ai-engine`

- Ollama constants
- model invocation abstraction
- future room for model switching and prompt strategy

### `packages/cache`

- cache reads/writes
- invalidation helpers
- rate-limit state

### `packages/queue`

- job contracts
- queue names
- worker-facing payload conventions

### `packages/email`

- email sending logic
- transactional template entry points
- Resend integration

### `packages/plugin-runtime`

- plugin manifest/runtime contract
- plugin loading primitives
- extension system foundation

## Why the project is shaped this way

The repo is optimized around speed of product iteration:

- Next.js for product surface
- Prisma for schema iteration
- Plausible instead of building a raw analytics engine
- Redis for cache and jobs
- Ably for collaboration
- Ollama for controllable AI

Each integration removes one major infrastructure problem from the app itself.

For onboarding clarity:

- local stateful services come from `docker-compose.yml`
- production stateful services move to managed Render infrastructure where available

## Current tradeoffs

These are intentional and important for new developers to know:

- the web app and worker currently share one production container
- app URL and Ollama URL are currently hardcoded in constants
- some platform features are more complete than others
- the docs aim to reflect the current code, not the original wishlist at full maturity
