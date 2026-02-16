# Stage 1: Install dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
# Menggunakan npm ci agar instalasi lebih cepat dan konsisten
RUN npm ci

# Stage 2: Build the app
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# --- TAMBAHAN UNTUK PRISMA ---
# Generate Prisma Client sebelum melakukan build Next.js
RUN npx prisma generate

ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Stage 3: Production runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy file publik dan folder statis
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# --- TAMBAHAN UNTUK RUNNER ---
# Memastikan file prisma terbawa agar query database berfungsi di server
COPY --from=builder /app/prisma ./prisma 

USER nextjs

EXPOSE 3001
ENV PORT 3001

# Jalankan aplikasi menggunakan server.js bawaan Next.js standalone
CMD ["node", "server.js"]