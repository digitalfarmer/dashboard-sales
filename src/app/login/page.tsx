'use client'; // WAJIB ada di baris pertama

import { useActionState } from 'react'; // Pakai 'react' langsung di Next.js 15
import { login } from '@/app/login/action';

export default function LoginPage() {
  // state: berisi return dari fungsi login (awalnya null)
  // formAction: fungsi yang ditaruh di <form action={...}>
  // isPending: boolean otomatis (true saat lagi proses kirim data)
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl w-full max-w-md border border-slate-100">
        <h2 className="text-2xl font-black text-slate-800 mb-2">Selamat Datang</h2>
        <p className="text-slate-500 mb-8 text-sm">Silakan login untuk akses dashboard sales</p>

        {/* Tampilkan Pesan Error Jika Ada */}
        {state?.error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold rounded-2xl animate-shake">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
              Username
            </label>
            <input
              name="username" // Pastikan ada name="username"
              type="text"
              required
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-slate-800"
              placeholder="Masukkan username"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
              Password
            </label>
            <input
              name="password" // Pastikan ada name="password"
              type="password"
              required
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-slate-800"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className={`w-full py-4 rounded-2xl font-bold text-white transition-all shadow-lg shadow-indigo-200 
              ${isPending 
                ? 'bg-slate-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]'}`}
          >
            {isPending ? 'Mohon Tunggu...' : 'Masuk ke Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}