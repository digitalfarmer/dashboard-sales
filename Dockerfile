# Stage 1: Install dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
# Menggunakan npm ci agar instalasi konsisten
RUN npm ci

# Stage 2: Build the app
FROM node:20-alpine AS builder
WORKDIR /app
# Ambil node_modules dari stage deps
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# --- PERBAIKAN: Instal dependensi pg & generate Prisma ---
# Kita paksa install pg di sini untuk memastikan adapter database tersedia
RUN npm install pg @prisma/adapter-pg
# Generate client berdasarkan skema yang ada di folder prisma
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

# Copy hasil build standalone
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Pastikan folder prisma juga terbawa ke runner untuk runtime query
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma 

USER nextjs

EXPOSE 3001
ENV PORT 3001

CMD ["node", "server.js"]