'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(prevState: any, formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  // 1. Validasi Input Kosong
  if (!username || !password) {
    return { error: 'Username dan password wajib diisi!' };
  }

  try {
    // 2. Cari user
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return { error: 'Username atau password salah!' };
    }

    // 3. Bandingkan password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return { error: 'Username atau password salah!' };
    }

    // 4. Simpan session di Cookie
    const sessionData = JSON.stringify({
      id: user.id,
      role: user.role,
      kodeCabang: user.kodeCabang,
      fullName: user.fullName
    });

    const cookieStore = await cookies();
    cookieStore.set('session', sessionData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 hari
      path: '/',
    });

  } catch (err) {
    // Tangani error database atau lainnya
    console.error("Login Error:", err);
    return { error: 'Terjadi kesalahan pada server.' };
  }

  // PENTING: Redirect harus di luar blok try-catch agar Next.js bisa handle dengan benar
  redirect('/dashboard');
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('session'); 
  redirect('/login'); 
}