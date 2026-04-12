FROM node:20-alpine AS base
RUN npm install -g pnpm@9

# ─── Builder ──────────────────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/shared-types/package.json packages/shared-types/package.json
COPY apps/frontend/package.json apps/frontend/package.json

RUN pnpm install --frozen-lockfile

COPY packages/shared-types/ packages/shared-types/
COPY apps/frontend/ apps/frontend/

# NEXT_PUBLIC_* vars are baked in at build time
ARG NEXT_PUBLIC_API_URL=http://localhost:3001
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN pnpm --filter @mini-survey/frontend build

# ─── Runner ───────────────────────────────────────────────────────────────────
FROM base AS runner
WORKDIR /app

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/shared-types/package.json packages/shared-types/package.json
COPY apps/frontend/package.json apps/frontend/package.json

RUN pnpm install --frozen-lockfile --prod

COPY packages/shared-types/ packages/shared-types/
COPY --from=builder /app/apps/frontend/.next/ apps/frontend/.next/

ENV PORT=3000
EXPOSE 3000

CMD ["pnpm", "--filter", "@mini-survey/frontend", "start"]
