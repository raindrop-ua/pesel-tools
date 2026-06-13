FROM node:24.16.0-alpine AS build
WORKDIR /app

ENV CYPRESS_INSTALL_BINARY=0 \
    NG_CLI_ANALYTICS=false \
    NPM_CONFIG_AUDIT=false \
    NPM_CONFIG_FUND=false

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:24.16.0-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    NPM_CONFIG_AUDIT=false \
    NPM_CONFIG_FUND=false

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist /app/dist

ENV PORT=4050
ENV HOST=0.0.0.0
EXPOSE 4050

CMD ["node", "dist/pesel-tools/server/server.mjs"]
