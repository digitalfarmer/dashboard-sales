// prisma.config.ts
import { defineConfig } from '@prisma/config';

// Bersihkan DATABASE_URL dari kemungkinan tanda petik yang terbawa dari shell/docker
const dbUrl = process.env.DATABASE_URL?.replace(/^['"]|['"]$/g, '');

export default defineConfig({
  migrations: {
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: dbUrl,
  },
});