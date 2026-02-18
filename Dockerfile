# Stage 1: Install dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: Build the app
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1

# Generate Prisma Client (ke custom path src/generated/prisma)
RUN npx prisma generate
RUN npm run build

# Stage 3: Production runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

# Install tool dasar
RUN apk add --no-cache libc6-compat
RUN npm install -g tsx prisma

# 1. Ambil Standalone Next.js
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# 2. Ambil SEMUA node_modules dari builder (KUNCI UTAMA)
# Ini agar sub-dependencies seperti 'postgres-array' tidak hilang
COPY --from=builder /app/node_modules ./node_modules

# 3. Ambil file Prisma
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src/generated ./src/generated
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/package.json ./

#RUN npm install
# Install dependencies yang dibutuhkan saat runtime (khususnya Prisma Client)
RUN npm install -g tsx prisma
RUN npm install @prisma/client @prisma/adapter-pg

EXPOSE 3001
ENV PORT 3001


CMD ["sh", "-c", "npx prisma db push && npx tsx prisma/seed.ts && node server.js"]