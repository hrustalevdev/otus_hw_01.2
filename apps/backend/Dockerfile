FROM node:20-alpine AS base
RUN npm install -g pnpm@9

# ─── Builder ──────────────────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app

# Copy workspace manifests first (layer caching)
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/shared-types/package.json packages/shared-types/package.json
COPY apps/backend/package.json apps/backend/package.json

RUN pnpm install --frozen-lockfile

# Copy source and build
COPY packages/shared-types/ packages/shared-types/
COPY apps/backend/src/ apps/backend/src/
COPY apps/backend/tsconfig.json apps/backend/tsconfig.json

RUN pnpm --filter @mini-survey/backend build

# ─── Runner ───────────────────────────────────────────────────────────────────
FROM base AS runner
WORKDIR /app

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/shared-types/package.json packages/shared-types/package.json
COPY apps/backend/package.json apps/backend/package.json

RUN pnpm install --frozen-lockfile --prod

COPY packages/shared-types/ packages/shared-types/
COPY --from=builder /app/apps/backend/dist/ apps/backend/dist/

ENV PORT=3001
ENV CORS_ORIGIN=http://localhost:3000

EXPOSE 3001

CMD ["node", "apps/backend/dist/app.js"]
