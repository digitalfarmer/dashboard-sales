import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getBranchMonthlyMatrix, getBranchPerformanceMetrics, getPerformanceMetrics, getSalesMonthlyMetrics } from '@/lib/clickhouse-service';
import BranchTrendLineChart from "@/components/dashboard/BranchTrendLineChart";
import ChartSales from '@/components/sales/ChartSales';
import FilterBar from "@/components/dashboard/FilterBar";
import { Suspense } from 'react';

import {
  Wallet, Truck, MapPin, TrendingUp, Calendar, ArrowRight, CalendarDays
} from 'lucide-react';
import { clickhouse } from '@/lib/clickhouse';
import BranchHorizontalChart from '@/components/dashboard/BranchHorizontalChart';

interface SalesData {
  fkmonth: string;
  total_netto_bersih: number;
  total_faktur: number;
  total_qty: number;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // 1. Validasi Session
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  if (!session) redirect('/login');

  const user = JSON.parse(session.value);
  const currentYear = new Date().getFullYear().toString(); // "2026"
  // 2. Await searchParams (Sesuai Next.js 15)
  const filtersFromUrl = await searchParams;
  const selectedBranch = (filtersFromUrl.branch as string) || user.kodeCabang;
  const selectedCategory = (filtersFromUrl.category as string) || 'ALL';
  const selectedYear = (filtersFromUrl.year as string) || currentYear;

  // 3. Ambil Nama Cabang & Data Sales secara Paralel (Biar Cepat)
  let salesData: SalesData[] = [];
  let displayBranchName = selectedBranch === 'ALL' ? 'Seluruh Cabang (Nasional)' : selectedBranch;

  try {
    const [salesResult, branchMeta] = await Promise.all([
      getSalesMonthlyMetrics(user, {
        branch: selectedBranch,
        category: selectedCategory,
        year: selectedYear
      }),
      selectedBranch !== 'ALL'
        ? clickhouse.query({
          query: `SELECT nama_cabang FROM dbw_bsp_konsolidasi.dw_ms_cabang WHERE kode_cabang = '${selectedBranch}' LIMIT 1`,
          format: 'JSONEachRow'
        }).then(res => res.json()) as Promise<any[]>
        : Promise.resolve([])
    ]);

    salesData = salesResult;
    if (branchMeta.length > 0) {
      displayBranchName = branchMeta[0].nama_cabang;
    }
  } catch (error) {
    console.error("Dashboard Data Error:", error);
  }

  // 4. Kalkulasi Stats
  const totalNetto = salesData.reduce((acc, curr) => acc + (curr.total_netto_bersih || 0), 0);
  const totalFaktur = salesData.reduce((acc, curr) => acc + (curr.total_faktur || 0), 0);
  const totalQty = salesData.reduce((acc, curr) => acc + (curr.total_qty || 0), 0);
  const hasData = salesData && salesData.length > 0;
  // Ambil data matrix dari ClickHouse
  const trendData = await getBranchPerformanceMetrics({
    branch: selectedBranch,
    year: selectedYear,
    category: selectedCategory
  });

  const performance = await getPerformanceMetrics(user, {
    branch: selectedBranch,
    year: selectedYear,
    category: selectedCategory
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      {/* FILTER AREA */}
      <Suspense fallback={<div className="h-20 bg-slate-100 animate-pulse rounded-3xl mb-8" />}>
        <FilterBar />
      </Suspense>

      {/* HEADER AREA */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-widest">
            <TrendingUp className="w-4 h-4" />
            <span>Analytics Real-time</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight dark:text-slate-200">
            Executive <span className="text-indigo-600">Dashboard</span>
          </h1>

          <div className="flex flex-wrap items-center gap-3 mt-3">
            {/* Badge Cabang */}
            <div className="flex items-center dark:bg-slate-800 gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-sm shadow-sm">
              <MapPin className="w-4 h-4 text-rose-500" />
              <span className="font-bold text-slate-700 dark:text-slate-200">{displayBranchName}</span>
            </div>

            {/* Badge Tahun */}
            <div className="flex items-center gap-2 dark:bg-slate-800 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-sm shadow-sm">
              <CalendarDays className="w-4 h-4 text-blue-500" />
              <span className="font-bold text-slate-700 dark:text-slate-300">Tahun {selectedYear}</span>
            </div>

            <span className="text-slate-300 hidden md:block">|</span>
            <span className="text-sm italic text-slate-500 dark:text-slate-400">User: {user.fullName}</span>
          </div>
        </div>
      </header>

      {/* STATS AREA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard title="Netto Sales" value={totalNetto} icon={<Wallet />} color="emerald" isCurrency />
        <StatCard title="Gross Sales" value={totalFaktur} icon={<Truck />} color="blue" isCurrency />
        <StatCard title="Total Volume" value={totalQty} icon={<Calendar />} color="orange" unit="Pcs" />
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 px-2 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Growth Analysis {selectedYear}
          </h3>
          <ChartSales data={salesData} />
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center justify-between">
            Breakdown Bulanan
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </h3>
          <div className="space-y-4 overflow-y-auto max-h-96 pr-2">
            {salesData.map((item, idx) => (
              <div key={`${item.fkmonth}-${idx}`} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100 group">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">{item.fkmonth}</p>
                  <p className="font-bold text-slate-700 dark:text-slate-300">Rp {(item.total_netto_bersih / 1e6).toFixed(1)}jt</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 uppercase">Qty</p>
                  <p className="text-sm font-semibold text-blue-600">{item.total_qty.toLocaleString('id-ID')}</p>
                </div>
              </div>
            ))}
            {!hasData && <p className="text-center text-slate-400 py-10 italic">Data tidak ditemukan.</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* TOP 5 SECTION */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
            <div className="p-2 bg-emerald-500 rounded-lg">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            Top 5 {performance.type} Terbesar
          </h3>
          <div className="space-y-4">
            {performance.top.map((item, idx) => (
              <div key={`top-${idx}`} className="group">
                <div className="flex justify-between mb-1 items-center">
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-400 truncate max-w-[200px]">{item.name}</span>
                  <span className="text-sm font-black text-emerald-600">Rp {(item.total_netto / 1e6).toFixed(1)}jt</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${(item.total_netto / (performance.top[0]?.total_netto || 1)) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM 5 SECTION */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
            <div className="p-2 bg-rose-500 rounded-lg">
              <TrendingUp className="w-4 h-4 text-white rotate-180" />
            </div>
            Bottom 5 {performance.type} Terkecil
          </h3>
          <div className="space-y-4">
            {performance.bottom.map((item, idx) => (
              <div key={`bottom-${idx}`} className="group">
                <div className="flex justify-between mb-1 items-center">
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-400 truncate max-w-[200px]">{item.name}</span>
                  <span className="text-sm font-black text-rose-600">Rp {(item.total_netto / 1e6).toFixed(1)}jt</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${(item.total_netto / (performance.top[0]?.total_netto || 1)) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
      {/* Chart Baru Kita */}
      <section className="mt-8">

        <BranchTrendLineChart
          key={`${selectedYear}-${selectedBranch}-${selectedCategory}`}
          data={trendData} />
      </section>


    </div>
  );
}

// Sub-komponen StatCard supaya kode di atas tidak terlalu panjang
function StatCard({ title, value, icon, color, isCurrency, unit }: any) {
  const colors: any = {
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600"
  };

  return (
    <div className="group bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl group-hover:scale-110 transition-transform ${colors[color]}`}>
          {icon}
        </div>
      </div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-black text-slate-900 dark:text-white">
        {isCurrency ? `Rp ${value.toLocaleString('id-ID')}` : `${value.toLocaleString('id-ID')} ${unit || ''}`}
      </h3>
    </div>
  );
}