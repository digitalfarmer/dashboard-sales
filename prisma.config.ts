// prisma.config.ts
import { defineConfig } from '@prisma/config';

export default defineConfig({
  migrations: {
    seed: 'tsx prisma/seed.ts',
  },
  // Prisma 7 sudah pintar baca DATABASE_URL dari env otomatis
});