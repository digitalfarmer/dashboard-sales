// BARIS PALING PENTING: Mencegah Next.js mencoba koneksi ke Clickhouse saat build di GitLab/Docker
export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getSalesMonthlyMetrics } from '@/lib/clickhouse-service';
import ChartSales from '@/components/sales/ChartSales';
import { logout } from '../login/action';
import {
  Wallet, Truck, LayoutDashboard,
  LogOut, MapPin, TrendingUp, Calendar, ArrowRight
} from 'lucide-react';

export default async function DashboardPage() {
  // 1. Autentikasi Session
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  
  if (!session) {
    redirect('/login');
  }

  // 2. Data Fetching
  let user;
  try {
    user = JSON.parse(session.value);
  } catch (e) {
    redirect('/login');
  }

  // Mengambil data dari Clickhouse
  const salesData = await getSalesMonthlyMetrics(user) || [];

  // 3. Perhitungan Ringkasan (Summary)
  const totalNetto = salesData.reduce((acc: number, curr: any) => acc + (curr.total_netto_bersih || 0), 0);
  const totalFaktur = salesData.reduce((acc: number, curr: any) => acc + (curr.total_faktur || 0), 0);
  const totalQty = salesData.reduce((acc: number, curr: any) => acc + (curr.total_qty || 0), 0);

  // 4. Logika Penamaan Cabang
  const namaCabangDariDB = salesData.length > 0 ? salesData[0].nama_cabang : null;
  const displayBranchName = user.kodeCabang === 'ALL'
    ? 'Nasional (Seluruh Wilayah)'
    : (namaCabangDariDB || user.namaCabang || `Cabang ${user.kodeCabang}`);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* HEADER AREA */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-widest">
            <TrendingUp className="w-4 h-4" />
            <span>Analytics Real-time</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Executive <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">Dashboard</span>
          </h1>
          <div className="flex items-center gap-3 text-slate-500">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-sm shadow-sm">
              <MapPin className="w-4 h-4 text-rose-500" />
              <span className="font-bold text-slate-700">{displayBranchName}</span>
            </div>
            <span className="text-slate-300">|</span>
            <span className="text-sm italic">User: {user.fullName}</span>
          </div>
        </div>

        <form action={logout}>
          <button type="submit" className="group flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl hover:bg-red-600 transition-all duration-300 shadow-xl shadow-slate-200">
            <span className="font-semibold">Logout</span>
            <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </header>

      {/* STATS AREA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Netto Card */}
        <div className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">Performance</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">Netto Sales</p>
          <h3 className="text-2xl font-black text-slate-900">
            Rp {totalNetto.toLocaleString('id-ID')}
          </h3>
        </div>

        {/* Faktur Card */}
        <div className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform">
              <Truck className="w-6 h-6" />
            </div>
          </div>
          <p className="text-slate-500 text-sm font-medium">Gross Sales</p>
          <h3 className="text-2xl font-black text-slate-900">
            Rp {totalFaktur.toLocaleString('id-ID')}
          </h3>
        </div>

        {/* Qty Card */}
        <div className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
          <p className="text-slate-500 text-sm font-medium">Total Volume (Qty)</p>
          <h3 className="text-2xl font-black text-slate-900">
            {totalQty.toLocaleString('id-ID')} <span className="text-sm font-normal text-slate-400">Pcs</span>
          </h3>
        </div>
      </div>

      {/* MAIN CONTENT (CHART & TABLE) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Grafik */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Growth Analysis
            </h3>
          </div>
          <ChartSales data={salesData} />
        </div>

        {/* Tabel Detail */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center justify-between text-lg">
            Breakdown Bulanan
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </h3>
          <div className="space-y-4 overflow-y-auto max-h-[450px] pr-2 custom-scrollbar">
            {salesData.length > 0 ? (
              salesData.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100 group">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.fkmonth}</p>
                    <p className="font-bold text-slate-800">
                      Rp {(item.total_netto_bersih / 1e6).toFixed(1)}jt
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Qty</p>
                    <p className="text-sm font-black text-blue-600">{item.total_qty.toLocaleString('id-ID')}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-400 italic text-sm">
                Tidak ada data tersedia
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}