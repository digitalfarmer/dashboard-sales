'use client';

import { logout } from '@/app/login/action'; // Impor action logout kamu
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  return (
    <button 
      onClick={async () => {
        await logout(); // Panggil fungsi logout yang menghapus cookie di server
      }}
      className="w-full flex items-center gap-2 p-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl font-semibold transition-colors"
    >
      <LogOut className="size-4" /> 
      <span>Keluar</span>
    </button>
  );
}