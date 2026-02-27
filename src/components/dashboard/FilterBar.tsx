"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { MapPin, Tag, Filter, Calendar, RefreshCcw } from "lucide-react";
import Select from 'react-select'; // Import react-select

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const user = session?.user as any;

  const [options, setOptions] = useState<{
    branches: { value: string; label: string }[],
    categories: { value: string; label: string }[],
    years: { value: string; label: string }[]
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
          // Mapping data ke format React-Select
          setOptions({
            branches: [
              { value: 'ALL', label: 'Nasional' },
              ...(data.cabang || []).map((b: any) => ({ value: b.kode_cabang, label: b.nama_cabang }))
            ],
            categories: [
              { value: 'ALL', label: 'Semua Divisi' },
              ...(data.divisi || []).map((c: any) => ({ value: c.kode_principal, label: c.nama_principal }))
            ],
            years: (data.tahun || []).map((y: string) => ({ value: y, label: y }))
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

  const handleFilterChange = (key: string, selectedOption: any) => {
    const value = selectedOption?.value;
    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== "ALL") {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    if (key === "year" || key === "branch") {
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

  // Custom Styles untuk menyesuaikan dengan Identity Tailwind/Indigo kamu
  const customSelectStyles = {
    control: (base: any) => ({
      ...base,
      backgroundColor: 'transparent',
      border: 'none',
      boxShadow: 'none',
      minHeight: '32px',
      cursor: 'pointer',
    }),
    valueContainer: (base: any) => ({ ...base, padding: '0 4px' }),
    input: (base: any) => ({ ...base, color: '#475569' }), // slate-600
    singleValue: (base: any) => ({ 
      ...base, 
      color: '#1e293b', // slate-800
      fontWeight: '700',
      fontSize: '14px'
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected ? '#4f46e5' : state.isFocused ? '#f5f3ff' : 'white',
      color: state.isSelected ? 'white' : '#475569',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
    }),
    menu: (base: any) => ({
      ...base,
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      border: '1px solid #f1f5f9'
    })
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-20 bg-white/50 backdrop-blur-md rounded-[2rem] border border-slate-200 mb-8 animate-pulse">
        <RefreshCcw className="w-5 h-5 text-indigo-500 animate-spin mr-2" />
        <span className="text-sm font-medium text-slate-500">Menyiapkan Filter...</span>
      </div>
    );
  }

  return (
    <div className={`relative ${isPending ? "opacity-50 pointer-events-none" : ""}`}>
      {isPending && (
        <div className="absolute -top-6 right-4 text-xs text-indigo-500 animate-pulse font-bold uppercase tracking-tighter">
          Updating Data...
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm mb-8 transition-all">
        <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold uppercase tracking-wider">
          <Filter className="w-3 h-3" />
        </div>

        {/* SELECT TAHUN */}
        <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-2xl border border-slate-100 dark:border-slate-700 min-w-[120px]">
          <Calendar className="w-4 h-4 text-slate-400" />
          <Select
            styles={customSelectStyles}
            options={options.years}
            value={options.years.find(y => y.value === (searchParams.get("year") || "2026"))}
            onChange={(opt) => handleFilterChange("year", opt)}
            isSearchable={false} // Tahun biasanya dikit, ga perlu search
            className="flex-1"
          />
        </div>

        {/* SELECT CABANG */}
        {user?.kodeCabang === "ALL" ? (
          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-2xl border border-slate-100 dark:border-slate-700 min-w-[220px]">
            <MapPin className="w-4 h-4 text-slate-400" />
            <Select
              styles={customSelectStyles}
              options={options.branches}
              value={options.branches.find(b => b.value === (searchParams.get("branch") || "ALL"))}
              onChange={(opt) => handleFilterChange("branch", opt)}
              isSearchable={true}
              placeholder="Cari Cabang..."
              className="flex-1"
            />
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/50 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 opacity-80">
            <MapPin className="w-4 h-4 text-indigo-500" />
            <span className="text-sm font-bold text-slate-500">Cabang: {user?.kodeCabang}</span>
          </div>
        )}

        {/* SELECT KATEGORI */}
        <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-2xl border border-slate-100 dark:border-slate-700 min-w-[250px]">
          <Tag className="w-4 h-4 text-slate-400" />
          <Select
            styles={customSelectStyles}
            options={options.categories}
            value={options.categories.find(c => c.value === (searchParams.get("category") || "ALL"))}
            onChange={(opt) => handleFilterChange("category", opt)}
            isSearchable={true}
            placeholder="Cari Divisi..."
            className="flex-1"
          />
        </div>

        {/* RESET */}
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