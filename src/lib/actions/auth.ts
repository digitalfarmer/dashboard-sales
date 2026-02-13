"use client"; // Kita buat wrapper nanti, tapi ini logikanya:

import { prisma } from "@/lib/prisma"; // Pastikan path prisma client kamu benar
import bcrypt from "bcryptjs";

export async function loginAction(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  // 1. Cari user di PostgreSQL
  const user = await prisma.user.findUnique({
    where: { username }
  });

  if (!user) {
    return { error: "User tidak ditemukan!" };
  }

  // 2. Cek Password
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    return { error: "Password salah!" };
  }

  // 3. Jika OK, kembalikan data penting (nanti kita simpan di Cookie/Session)
  return { 
    success: true, 
    user: { 
      id: user.id, 
      role: user.role, 
      kodeCabang: user.kodeCabang 
    } 
  };
}