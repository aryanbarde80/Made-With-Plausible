# Platform Roadmap

## Priority order

The current platform expansion order is:

1. Sentry
2. OpenRouter
3. Anomaly detection
4. RAG + vector search
5. Warehouse export
6. SSO

## Why this order

- Sentry makes the rest safer to build and operate.
- OpenRouter improves AI flexibility quickly.
- anomaly detection creates immediate product value.
- RAG makes the AI layer materially smarter.
- warehouse export unlocks enterprise data workflows.
- SSO is important, but more auth-sensitive, so it benefits from better observability first.

## What exists now

### Sentry foundation

- Next.js instrumentation entrypoints
- worker monitoring bootstrap
- release/environment-aware init path

### OpenRouter foundation

- hosted model routing in the AI engine
- embeddings support
- provider fallback path

### Anomaly detection foundation

- anomaly model
- anomaly router
- anomaly worker job

### RAG + vector search foundation

- search document model
- embeddings generation
- vector indexing job
- semantic search router
- retrieved context injection into AI requests

### Warehouse export foundation

- warehouse destination model
- export run model
- warehouse router
- worker export job

### SSO foundation

- SSO connection model
- encrypted secret storage path
- SSO router
- authorization URL generation
- callback entrypoint

## Honest status

These features now exist at a meaningful foundation level, but not every one of them is yet a fully mature enterprise implementation.

The strongest parts today are:

- Sentry wiring
- OpenRouter routing
- anomaly persistence
- vector indexing and semantic lookup

The areas that still need a deeper next phase are:

- provider-specific warehouse push adapters
- full OIDC token exchange and JIT provisioning
- richer anomaly scoring
- broader search ingestion sources

## Next phases

### Phase 1

- richer Sentry tags for org/user/site/request
- anomaly dashboard UI
- semantic search UI
- security event expansion

### Phase 2

- BigQuery exporter adapter
- Snowflake exporter adapter
- wider search ingestion from reports and annotations
- AI report writer over retrieved context

### Phase 3

- OIDC token exchange
- JIT org membership provisioning
- domain claims
- SCIM planning
