# syntax=docker/dockerfile:1

# ---------- Build stage ----------
FROM node:24.16.0-alpine AS build
WORKDIR /app

ENV HUSKY=0 \
    CYPRESS_INSTALL_BINARY=0 \
    NG_CLI_ANALYTICS=false

RUN corepack enable pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pesel-tools-pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --store-dir=/pnpm/store

COPY . .
RUN pnpm build

# ---------- Runtime stage ----------
FROM node:24.16.0-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production \
    PORT=4200 \
    HOST=0.0.0.0

COPY --from=build --chown=node:node /app/dist/pesel-tools ./dist/pesel-tools

USER node

EXPOSE 4200

# Consume the SSR body and exit explicitly before Docker's timeout.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT || 4200) + '/', { signal: AbortSignal.timeout(4000) }).then(async response => { if (!response.ok) throw new Error('HTTP ' + response.status); await response.arrayBuffer(); process.exit(0); }).catch(error => { console.error('Healthcheck failed:', error); process.exit(1); })"

CMD ["node", "dist/pesel-tools/server/server.mjs"]
