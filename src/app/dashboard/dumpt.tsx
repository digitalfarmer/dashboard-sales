// src/app/dashboard/page.tsx

// ... import lainnya
import { MapPin, TrendingUp, CalendarDays } from "lucide-react";

export default async function DashboardPage({ searchParams }: any) {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  if (!session) return redirect('/login');

  const user = JSON.parse(session.value);
  const filters = await searchParams;

  const selectedYear = filters.year || new Date().getFullYear().toString();
  const selectedBranch = filters.branch || user.kodeCabang;
  const selectedCategory = filters.category || 'ALL';

  // --- QUERY NAMA CABANG UNTUK HEADER ---
  let displayBranchName = "Nasional";
  if (selectedBranch !== 'ALL') {
    const branchMeta = await clickhouse.query({
      query: `SELECT nama_cabang FROM dbw_bsp_konsolidasi.dw_ms_cabang WHERE kode_cabang = '${selectedBranch}' LIMIT 1`,
      format: 'JSONEachRow',
    }).then(res => res.json()) as any[];
    
    displayBranchName = branchMeta[0]?.nama_cabang || selectedBranch;
  }

  // --- AMBIL DATA SALES ---
  const salesData = await getSalesMonthlyMetrics(user, {
    branch: selectedBranch,
    category: selectedCategory,
    year: selectedYear
  });

  return (
    <main className="p-8">
      {/* HEADER BARU */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-widest">
            <TrendingUp className="w-4 h-4" />
            <span>Analytics Real-time</span>
          </div>
          
          <h1 className="text-3xl font-black text-slate-900 tracking-tight dark:text-slate-200">
            Executive <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">Dashboard</span>
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-slate-500 mt-2">
            {/* Lokasi Cabang */}
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-sm shadow-sm transition-all hover:border-blue-300">
              <MapPin className="w-4 h-4 text-rose-500" />
              <span className="font-bold text-slate-700">{displayBranchName}</span>
            </div>

            {/* Tahun Aktif */}
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-sm shadow-sm">
              <CalendarDays className="w-4 h-4 text-blue-500" />
              <span className="font-bold text-slate-700">Tahun {selectedYear}</span>
            </div>

            <span className="text-slate-300 hidden md:block">|</span>
            <span className="text-sm italic font-medium">User: {user.fullName}</span>
          </div>
        </div>

        {/* Bisa ditambahin tombol Export PDF atau info Update Terakhir di sini */}
      </header>

      {/* FILTER BAR & CONTENT */}
      <FilterBar />
      
      {/* ... sisanya (Stats Cards & Charts) */}
    </main>
  );
}