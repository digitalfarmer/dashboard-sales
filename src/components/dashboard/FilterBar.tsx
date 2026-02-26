"use client";

import { startTransition, useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useSession } from "next-auth/react"; // 1. Tambahkan session
import { MapPin, Tag, Filter, Calendar, RefreshCcw } from "lucide-react"; // Fix typo lucide-react jika ada
import { useTransition } from "react"; // Tambahkan ini untuk indikator loading

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession(); // 2. Ambil data user login
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition(); // Hook untuk mantau proses pindah halaman

  const user = session?.user as any;

  const [options, setOptions] = useState<{
    branches: any[],
    categories: any[],
    years: string[]
  }>({
    branches: [],
    categories: [],
    years: []
  });

  useEffect(() => {
    async function fetchFilters() {
      try {
        setLoading(true);
        const res = await fetch("/dashboard/filters");
        const data = await res.json();
        if (!data.error) {
          setOptions({
            branches: data.cabang || [],
            categories: data.divisi || [],
            years: data.tahun || []
          });
        }
      } catch (err) {
        console.error("Gagal ambil filter:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFilters();
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== "ALL") {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // --- LOGIC REVISI DISINI ---

    // 1. Jika ganti TAHUN, reset Kategori (tapi Cabang biarkan tetap)
    if (key === "year") {
      params.delete("category");
    }

    // 2. Jika ganti CABANG, reset Kategori juga (karena divisi tiap cabang bisa beda)
    if (key === "branch") {
      params.delete("category");
    }

    startTransition(() => {
      router.push(`?${params.toString()}`);
      router.refresh();
    });
  };

  const resetAll = () => {
    const basePath = pathname.includes('pivot') ? '/pivot' : '/dashboard';
    router.push(basePath);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-20 bg-white/50 backdrop-blur-md rounded-[2rem] border border-slate-200 mb-8 animate-pulse">
        <RefreshCcw className="w-5 h-5 text-blue-500 animate-spin mr-2" />
        <span className="text-sm font-medium text-slate-500">Menyiapkan Filter...</span>
      </div>
    );
  }

  return (
    <div className={`relative ${isPending ? "opacity-50 pointer-events-none" : ""}`}>
      {/* Tampilkan Loading Spinner kecil kalau isPending true */}
      {isPending && (
        <div className="absolute -top-6 right-4 text-xs text-indigo-500 animate-pulse font-bold">
          Updating data...
        </div>
      )}
    <div className="flex flex-wrap items-center gap-4 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm mb-8 transition-all">
      <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider">
        <Filter className="w-3 h-3" />
      </div>

      {/* FILTER TAHUN */}
      <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-2xl border border-slate-100 dark:border-slate-700 focus-within:ring-2 ring-blue-500/20 transition-all">
        <Calendar className="w-4 h-4 text-slate-400" />
        <select
          aria-label="Filter Tahun"
          onChange={(e) => handleFilterChange("year", e.target.value)}
          // Jika di URL tidak ada year, tampilkan 2026
          value={searchParams.get("year") || "2026"}
          className="bg-transparent text-sm font-bold text-slate-700 dark:text-slate-300 outline-none"
        >
          {options.years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* FILTER CABANG: Hanya muncul jika user PUSAT (ALL) */}
      {user?.kodeCabang === "ALL" ? (
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-2xl border border-slate-100 dark:border-slate-700 focus-within:ring-2 ring-blue-500/20 transition-all">
          <MapPin className="w-4 h-4 text-slate-400" />
          <select
            aria-label="Filter cabang"
            onChange={(e) => handleFilterChange("branch", e.target.value)}
            value={searchParams.get("branch") || "ALL"}
            className="bg-transparent text-sm font-bold text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
          >
            <option value="ALL">Nasional</option>
            {options.branches.map((b) => (
              <option key={b.kode_cabang} value={b.kode_cabang}>{b.nama_cabang}</option>
            ))}
          </select>
        </div>
      ) : (
        // Jika user Cabang, tampilkan text saja (tidak bisa diubah)
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/50 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 opacity-80">
          <MapPin className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-bold text-slate-500 tracking-tight">
            Cabang: {user?.kodeCabang}
          </span>
        </div>
      )}

      {/* FILTER KATEGORI */}
      <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-2xl border border-slate-100 dark:border-slate-700 focus-within:ring-2 ring-blue-500/20 transition-all">
        <Tag className="w-4 h-4 text-slate-400" />
        <select
          aria-label="Filter kategori"
          onChange={(e) => handleFilterChange("category", e.target.value)}
          value={searchParams.get("category") || "ALL"}
          className="bg-transparent text-sm font-bold text-slate-700 dark:text-slate-300 outline-none min-w-[150px]"
        >
          <option value="ALL">Semua Divisi</option>
          {options.categories.map((c: any, idx: number) => (
            /* Gunakan kombinasi kode dan index biar benar-benar unik */
            <option
              key={c.kode_principal ? `principal-${c.kode_principal}` : `idx-${idx}`}
              value={c.kode_principal || ""}
            >
              {c.nama_principal || "Tanpa Nama"}
            </option>
          ))}
        </select>
      </div>

      {/* RESET BUTTON */}
      {(searchParams.get("branch") || searchParams.get("category") || searchParams.get("year")) && (
        <button
          type="button"
          onClick={resetAll}
          className="ml-auto text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 px-3 py-2 hover:bg-rose-50 rounded-xl transition-all"
        >
          <RefreshCcw className="w-3 h-3" />
          Clear
        </button>
      )}
    </div>
    </div>
  );
}