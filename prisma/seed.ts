import { PrismaClient } from '../src/generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { createId } from '@paralleldrive/cuid2';
import bcrypt from 'bcryptjs';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const salt = await bcrypt.genSalt(10);
  const passwordAdmin = await bcrypt.hash('admin123', salt);
  const passwordCabang = await bcrypt.hash('cabang123', salt);

  // 1. Buat Super Admin
  await prisma.user.upsert({
    where: { username: 'admin_pusat' },
    update: {},
    create: {
      id: `user_${createId()}`,
      username: 'admin_pusat',
      passwordHash: passwordAdmin,
      fullName: 'Ade Setiawan',
      role: 'SUPER_ADMIN',
      kodeCabang: 'ALL',
    },
  });

  // 2. Buat Kepala Cabang
  await prisma.user.upsert({
    where: { username: 'kancab_bandung' },
    update: {},
    create: {
      id: `user_${createId()}`,
      username: 'kancab_bandung',
      passwordHash: passwordCabang,
      fullName: 'Asep Bandung',
      role: 'KEPALA_CABANG',
      kodeCabang: 'BDG',
    },
  });

  console.log('✅ Seed data sukses dimasukkan!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });