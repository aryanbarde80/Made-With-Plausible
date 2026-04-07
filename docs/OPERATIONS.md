# Operations Guide

## Health and runtime behavior

The production web service starts two processes:

- the Next.js server
- the worker loop

The worker is launched in the background by `apps/web/start.sh`.

Operationally, that means:

- one service is easier to manage
- web and worker failures are more coupled
- logs should be read with both app and worker behavior in mind

## Main things to monitor

### Application availability

Check:

- `/api/health`
- Render service status
- deploy logs

### Database health

Check:

- connection issues
- migration failures
- Prisma runtime errors

### Redis health

Check:

- cache errors
- queue issues
- job timing drifts
- Celery broker or result-backend issues if the optional Python worker is enabled

### Plausible health

Check:

- API availability
- auth errors
- upstream response shape changes

### Ably health

Check:

- client connection success
- publish/subscribe failures
- auth key format problems

### Resend health

Check:

- sender verification
- send failures
- rate or domain issues

### Ollama health

Check:

- endpoint responsiveness
- model availability
- inference latency

## Incident triage

### If login is broken

Check:

- database connectivity
- session storage logic
- email delivery if using magic links

### If analytics is broken

Check:

- Plausible env vars
- upstream Plausible health
- site mapping in database

### If AI is broken

Check:

- Ollama service URL
- model availability
- prompt/context construction

### If alerts or reports are not happening

Check:

- Redis availability
- worker loop logs
- database records for scheduled tasks
- email delivery

If the optional Celery sidecar is enabled, also check:

- Celery worker logs
- Redis broker/back-end connectivity

## Keeping the service awake

If you run on a free plan and want to keep the service warm, call the health route periodically:

```sh
curl -fsS https://pulseboard-web.onrender.com/api/health > /dev/null
```

A 14-minute interval is a reasonable keepalive cadence for hobby usage. On paid plans, this is usually unnecessary.

## Operational tradeoffs to remember

- The current single-container app+worker setup is simpler, but not as isolated as a separate worker deployment.
- Hardcoded service URLs make setup easier today, but increase maintenance when endpoints change.
- Fallback behavior can mask missing integration config during early deployment testing.

## Recommended next hardening steps

- move hardcoded service URLs back into managed env once deployment stabilizes
- split worker into its own service when background throughput grows
- add stronger runtime metrics and alerting around external dependencies
- document plugin publishing lifecycle once the marketplace flow is finalized
