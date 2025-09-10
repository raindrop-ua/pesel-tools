FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22-bullseye-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist /app/dist

ENV PORT=4050
ENV HOST=0.0.0.0
EXPOSE 4050

CMD ["npm", "run", "start:ssr"]
