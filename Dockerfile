# Stage 1: Install dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: Build the app2
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .


ENV NEXT_TELEMETRY_DISABLED=1
# URL Dummy hanya agar Prisma tidak error saat kompilasi
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
# ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
# ENV NEXTAUTH_URL=${NEXTAUTH_URL}
RUN rm -rf .next

RUN npm install pg @prisma/adapter-pg && \
    npm install --save-dev @types/pg && \
    npm install bcrypt && \
    npx prisma generate


# Generate Prisma Client (ke custom path src/generated/prisma)
RUN npx prisma generate
RUN npm run build


# ... (Stage 3 tetap sama)

# Stage 3: Production runner
FROM node:20-alpine AS runner
WORKDIR /app


ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3001


# Install tool dasar
RUN apk add --no-cache libc6-compat
RUN npm install -g tsx prisma

# 1. Ambil Standalone Next.js
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy hasil build standalone
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma 


# 2. Ambil SEMUA node_modules dari builder 
# Ini agar sub-dependencies seperti 'postgres-array' tidak hilang
COPY --from=builder /app/node_modules ./node_modules

# 3. Ambil file Prisma
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src/generated ./src/generated
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/package.json ./

RUN npm install -g tsx prisma
RUN npm install @prisma/client @prisma/adapter-pg

EXPOSE 3001


CMD ["sh", "-c", "npx prisma db push && npx tsx prisma/seed.ts && node server.js"]