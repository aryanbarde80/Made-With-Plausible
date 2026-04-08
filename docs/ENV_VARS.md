# Environment Variables Guide

This document provides a comprehensive list of environment variables used in PulseBoard.

## Core Infrastructure

| Variable | Description | Default / Example |
|----------|-------------|-------------------|
| `NODE_ENV` | Application environment | `development`, `production` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:port/db` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js session encryption | A long random string |
| `SESSION_COOKIE_NAME` | Name of the session cookie | `pulseboard.session` |

## Analytics (Plausible)

| Variable | Description | Default / Example |
|----------|-------------|-------------------|
| `PLAUSIBLE_BASE_URL` | Base URL of your Plausible instance | `http://localhost:8001` |
| `PLAUSIBLE_API_KEY` | API key for Plausible | `plausible-api-key` |
| `PLAUSIBLE_SITE_URL` | Public URL of your Plausible instance | `http://localhost:8001` |

## Realtime (Ably)

| Variable | Description | Default / Example |
|----------|-------------|-------------------|
| `ABLY_API_KEY` | Full Ably API key (root key) | `key:secret` |
| `NEXT_PUBLIC_ABLY_KEY` | Public portion of the Ably key | `key` |

## AI & LLM

| Variable | Description | Default / Example |
|----------|-------------|-------------------|
| `OLLAMA_BASE_URL` | Base URL for Ollama API | `http://localhost:11434` |
| `OLLAMA_MODEL` | Default Ollama model to use | `llama3.2:1b` |
| `OPENROUTER_API_KEY` | API key for OpenRouter | |
| `GROQ_KEY` | API key for Groq | |
| `DEEPSEEK_KEY` | API key for DeepSeek | |

## Email (Resend)

| Variable | Description | Default / Example |
|----------|-------------|-------------------|
| `RESEND_API_KEY` | API key for Resend | |
| `RESEND_FROM` | Sender email address | `PulseBoard <onboarding@resend.dev>` |

## Observability (Sentry)

| Variable | Description | Default / Example |
|----------|-------------|-------------------|
| `SENTRY_DSN` | Sentry DSN for error tracking | |
| `NEXT_PUBLIC_SENTRY_DSN` | Public Sentry DSN for frontend | |

## Other Configurations

| Variable | Description | Default / Example |
|----------|-------------|-------------------|
| `PUBLIC_DEFAULT_ORG_SLUG` | Default organization slug | `demo` |
| `DOCS_URL` | URL for the documentation site | `http://localhost:3002` |
| `PUBLIC_APP_NAME` | Name of the application | `PulseBoard` |
| `PUBLIC_PRIMARY_COLOR` | Primary theme color | `#7c3aed` |
