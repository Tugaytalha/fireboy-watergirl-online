# ─── Stage 1: Build ────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
COPY shared/package.json shared/
COPY client/package.json client/
COPY server/package.json server/

RUN npm ci

COPY shared/ shared/
COPY client/ client/
COPY server/ server/
COPY tsconfig.base.json ./

RUN npm run build

# ─── Stage 2: Production ──────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/shared/package.json shared/
COPY --from=builder /app/server/package.json server/

# Install production dependencies only
RUN npm ci --omit=dev --workspace=server --workspace=shared

COPY --from=builder /app/shared/dist/ shared/dist/
COPY --from=builder /app/server/dist/ server/dist/
COPY --from=builder /app/client/dist/ client/dist/

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "server/dist/index.js"]
