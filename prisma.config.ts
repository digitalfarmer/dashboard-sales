// prisma.config.ts
import { defineConfig } from '@prisma/config';

export default defineConfig({
  migrations: {
    seed: 'tsx prisma/seed.ts',
  },
  // Tambahkan ini biar 'migrate deploy' nggak protes
  datasource: {
    url: process.env.DATABASE_URL,
  },
});