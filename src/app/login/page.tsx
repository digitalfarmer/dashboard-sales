"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BarChart3, Lock, User, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Username atau password salah!");
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* LOGO BOX */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 px-4 py-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none mb-4">
            <BarChart3 className="text-white size-6" />
            <span className="text-white font-black tracking-tight text-xl">BI-SYSTEM</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Selamat Datang</h2>
          <p className="text-slate-500 text-sm">Silahkan login untuk akses dashboard</p>
        </div>

        {/* FORM CARD */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-2xl border border-slate-100 dark:border-slate-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl border border-red-100 font-bold text-center">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-3.5 size-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-semibold"
                  placeholder="Masukkan username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 size-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-semibold"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" /> : "MASUK KE DASHBOARD"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}