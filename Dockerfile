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

RUN apk add --no-cache libc6-compat

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src/generated ./src/generated
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma.config.ts ./ 

# Install dependencies yang dibutuhkan saat runtime
RUN npm install -g tsx prisma
RUN npm install @prisma/client @prisma/adapter-pg

EXPOSE 3001
ENV PORT 3001

# Script sakti: Migrasi dulu, Seed dulu, baru nyalain server
CMD ["sh", "-c", "npx prisma migrate deploy && npx tsx prisma/seed.ts && node server.js"]