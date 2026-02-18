import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getSalesMonthlyMetrics } from '@/lib/clickhouse-service';
import ChartSales from '@/components/sales/ChartSales';
import {
  Wallet, Truck, RotateCcw, LayoutDashboard,
  LogOut, MapPin, TrendingUp, Calendar, ArrowRight
} from 'lucide-react';
// 
interface SalesData {
  nama_cabang: string;
  fkmonth: string;
  total_netto_bersih: number;
  total_faktur: number;
  total_qty: number;
  //
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  if (!session) redirect('/login');

  const user = JSON.parse(session.value);
  const salesData = await getSalesMonthlyMetrics(user);

  // Perhitungan Ringkasan
  const totalNetto = salesData.reduce((acc: number, curr: any) => acc + curr.total_netto_bersih, 0);
  const totalFaktur = salesData.reduce((acc: number, curr: any) => acc + curr.total_faktur, 0);
  const totalQty = salesData.reduce((acc: number, curr: any) => acc + curr.total_qty, 0);

  const hasData = salesData && salesData.length > 0;
  //const namaCabangDariDB = salesData.length > 0 ? salesData[0].nama_cabang : user.kodeCabang;
  const namaCabangDariDB = hasData ? (salesData as SalesData[])[0].nama_cabang : 'General';

  const displayBranchName = user.kodeCabang === 'ALL'
    ? 'Nasional (Seluruh Wilayah)'
    : (namaCabangDariDB || user.namaCabang || `Cabang ${user.kodeCabang}`);

  return (

    <div className="max-w-7xl mx-auto">

      {/* HEADER AREA */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-widest">
            <TrendingUp className="w-4 h-4" />
            <span>Analytics Real-time</span>
          </div>
          {/* ... Header ... */}
          <h1 className="text-3xl font-black text-slate-900 tracking-tight dark:text-slate-200">
            Executive <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">Dashboard</span>
          </h1>
          <div className="flex items-center gap-3 text-slate-500">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-sm shadow-sm">
              <MapPin className="w-4 h-4 text-rose-500" />
              {/* TAMPILKAN NAMA CABANG BUKAN KODE */}
              <span className="font-bold text-slate-700">{displayBranchName}</span>
            </div>
            <span className="text-slate-300">|</span>
            <span className="text-sm italic">User: {user.fullName}</span>
          </div>
        </div>

        
      </header>

      {/* STATS AREA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        {/* Netto Card */}
        <div className="group bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl group-hover:scale-110 transition-transform">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-lg">
              +12% vs Last Year
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Netto Sales</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">
            Rp {totalNetto.toLocaleString('id-ID')}
          </h3>
        </div>

        {/* Faktur Card */}
        <div className="group bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl group-hover:scale-110 transition-transform">
              <Truck className="w-6 h-6" />
            </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Gross Sales</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">
            Rp {totalFaktur.toLocaleString('id-ID')}
          </h3>
        </div>

        {/* Qty Card */}
        <div className="group bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-2xl group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Volume (Qty)</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">
            {totalQty.toLocaleString('id-ID')} Pcs
          </h3>
        </div>
      </div>

      {/* MAIN CONTENT (CHART & TABLE) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">

        {/* Grafik - Ambil 2/3 tempat */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
          <div className="flex items-center justify-between mb-6 px-2">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              Growth Analysis
            </h3>
          </div>
          {/* Pastikan di dalam ChartSales kamu juga menangani warna Grid/Text via props atau CSS */}
          <ChartSales data={salesData} />
        </div>

        {/* Tabel Detail - Ambil 1/3 tempat */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center justify-between">
            Breakdown Bulanan
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </h3>

          <div className="space-y-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
            {salesData.map((item: any, idx: number) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all border border-transparent hover:border-blue-100 dark:hover:border-blue-800 group"
              >
                <div>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">{item.fkmonth}</p>
                  <p className="font-bold text-slate-700 dark:text-slate-200">
                    Rp {(item.total_netto_bersih / 1e6).toFixed(1)}jt
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase">Qty</p>
                  <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{item.total_qty}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>

  );
}