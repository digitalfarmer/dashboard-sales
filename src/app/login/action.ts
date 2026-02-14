'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  // 1. Cari user
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) return { error: 'Username atau password salah!' };

  // 2. Bandingkan password (bcrypt)
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) return { error: 'Username atau password salah!' };

  // 3. Simpan session sederhana di Cookie (bisa diimprove pakai JWT nanti)
  // Untuk sementara, kita simpan data dasar dulu
  const sessionData = JSON.stringify({
    id: user.id,
    role: user.role,
    kodeCabang: user.kodeCabang,
    fullName: user.fullName
  });

  (await cookies()).set('session', sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 1 hari
    path: '/',
  });

  redirect('/dashboard');
}
export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('session'); // Hapus cookie session
  redirect('/login'); // Tendang balik ke halaman login
}