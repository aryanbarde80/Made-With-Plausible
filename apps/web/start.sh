#!/bin/sh
set -eu

cd /app/packages/db
pnpm exec prisma db push --schema prisma/schema.prisma

cd /app
node /app/apps/worker/dist/index.js &
WORKER_PID=$!

cleanup() {
  kill "$WORKER_PID" 2>/dev/null || true
}

trap cleanup EXIT INT TERM

cd /app/apps/web
exec pnpm exec next start -p "${PORT:-10000}" -H 0.0.0.0
