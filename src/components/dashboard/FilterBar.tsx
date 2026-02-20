"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MapPin, Tag, Filter, Calendar, RefreshCcw } from "lucide-react";

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);

  const [options, setOptions] = useState<{
    branches: any[],
    categories: any[],
    years: string[]
  }>({
    branches: [],
    categories: [],
    years: []
  });

  // 1. Fetch Options (Tahun, Cabang, Principal)
  useEffect(() => {
    async function fetchFilters() {
      try {
        setLoading(true);
        const res = await fetch("/dashboard/filters");
        const data = await res.json();
        if (!data.error) {
          setOptions({
            branches: data.branches || [],
            categories: data.categories || [],
            years: data.years || []
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
  // 2. Logic Update URL & Reset
  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== "ALL") {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // SPECIAL LOGIC: Jika cabang diganti, reset category ke ALL
    if (key === "branch") {
      params.delete("category");
    }

    router.push(`?${params.toString()}`);
  };

  // 3. Reset All Filters
  const resetAll = () => {
    router.push('/dashboard'); // Kembali ke default (Tahun Berjalan, Cabang User, Semua Principal)
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
    <div className="flex flex-wrap items-center gap-4 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm mb-8 transition-all">
      <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider">
        <Filter className="w-3 h-3" />
        {/* <span>Quick Filters</span> */}
      </div>
      {/* Select Tahun */}
      <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-2xl border border-slate-100 dark:border-slate-700 focus-within:ring-2 ring-blue-500/20 transition-all">
        <Calendar className="w-4 h-4 text-slate-400" />
        <select
          aria-label="Filter Tahun"
          onChange={(e) => handleFilterChange("year", e.target.value)}
          value={searchParams.get("year") || new Date().getFullYear().toString()}
          className="bg-transparent text-sm font-bold text-slate-700 dark:text-slate-300 outline-none"

        >
          {options.years.map((y) => (
            <option className="text-slate-700 dark:text-slate-800" key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Select Cabang */}
      <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-2xl border border-slate-100 dark:border-slate-700 focus-within:ring-2 ring-blue-500/20 transition-all">
        <MapPin className="w-4 h-4 text-slate-400" />
        <select
         aria-label="Filter cabang"
          onChange={(e) => handleFilterChange("branch", e.target.value)}
          value={searchParams.get("branch") || "ALL"}
          className="bg-transparent text-sm font-bold text-slate-700 dark:text-slate-700 outline-none cursor-pointer"
        >
          {options.branches.map((b) => (
            <option className="text-slate-700 " key={b.kodeCabang} value={b.kodeCabang}>{b.fullName}</option>
          ))}
        </select>
      </div>

      {/* Dropdown Principal - DISESUAIKAN DENGAN NAMA KOLOM API */}
      <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-2xl border border-slate-100 dark:border-slate-700 focus-within:ring-2 ring-blue-500/20 transition-all">
        <Tag className="w-4 h-4 text-slate-400" />
        <select
          aria-label="Filter kategori"
          onChange={(e) => handleFilterChange("category", e.target.value)}
          value={searchParams.get("category") || "ALL"}
          className="bg-transparent text-sm font-bold text-slate-700 dark:text-slate-300 outline-none min-w-[150px]"
        >
          <option className="text-slate-700 " value="ALL">Semua Principal</option>
          {options.categories.map((c: any) => (
  <option className="dark:text-slate-800" key={c.kode_principal} value={c.kode_principal}>
    {c.nama_principal || c.kode_principal}
  </option>
))}
        </select>
      </div>
      {/* Tombol Clear Filter */}
      {(searchParams.get("branch") || searchParams.get("category") || searchParams.get("year")) && (
        <button 
          onClick={resetAll}
          className="ml-auto text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 px-3 py-2 hover:bg-rose-50 rounded-xl transition-all"
        >
          <RefreshCcw className="w-3 h-3" />
          Clear
        </button>
      )}
    </div>
  );
}