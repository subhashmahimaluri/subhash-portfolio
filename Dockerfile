# syntax=docker/dockerfile:1

# Multi-stage build for a Next.js (standalone) app that generates PDFs with
# Puppeteer. The runner installs system Chromium instead of Puppeteer's bundled
# binary (which is not Alpine-compatible).

FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
# Skip Puppeteer's Chromium download during npm install; we use system Chromium.
ENV PUPPETEER_SKIP_DOWNLOAD=true \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    NEXT_TELEMETRY_DISABLED=1

# ---------- Dependencies ----------
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# ---------- Builder ----------
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# NEXT_PUBLIC_* are inlined into the client bundle at BUILD time — pass them as
# build args (docker-compose build.args), not just runtime env.
ARG NEXT_PUBLIC_SITE_URL=https://subhashai.cloud
ARG NEXT_PUBLIC_SITE_NAME=subhashai.cloud
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL} \
    NEXT_PUBLIC_SITE_NAME=${NEXT_PUBLIC_SITE_NAME}
RUN npm run build

# ---------- Runner ----------
FROM base AS runner
WORKDIR /app

# Chromium + fonts for Puppeteer PDF generation.
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    font-noto

ENV NODE_ENV=production \
    PORT=3005 \
    HOSTNAME=0.0.0.0 \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Standalone output + static assets + public dir.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3005

CMD ["node", "server.js"]
