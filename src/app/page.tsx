"use client";

import { useState, useEffect } from 'react';
import dynamicNext from 'next/dynamic';
import SalesChart from '@/components/SalesChart';
import { useDashboardData } from '@/hooks/useDashboardData';
import FilterBar from '@/components/FilterBar';
import TopProductsTable from '@/components/TopProductsTable';
import SummaryCards from '@/components/SummaryCards';
import { SkeletonCard, SkeletonTable } from '@/components/LoadingSkeleton';

// 1. Dynamic Import untuk Komponen Berat / Browser-only
const DistributionMap = dynamicNext(() => import('@/components/DistributionMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full bg-gray-100 animate-pulse flex items-center justify-center rounded-xl border border-dashed border-gray-300">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
        <p className="text-sm text-gray-500 font-medium">Menyiapkan Peta Distribusi...</p>
      </div>
    </div>
  )
});

export default function Dashboard() {
  const currentYear = new Date().getFullYear().toString();

  // 2. States untuk Filter
  const [selectedTahun, setSelectedTahun] = useState(currentYear);
  const [selectedCabang, setSelectedCabang] = useState('all');
  const [selectedDivisi, setSelectedDivisi] = useState('all');

  // 3. Data Fetching via Custom Hook
  const { 
    data, 
    topProducts, 
    mapData, 
    isLoading, 
    error, 
    summary, 
    trends, 
    lastUpdated 
  } = useDashboardData(selectedTahun, selectedCabang, selectedDivisi);

  // 4. State untuk Master Data Filter (diambil dari API)
  const [listFilters, setListFilters] = useState({ 
    cabang: [], 
    divisi: [], 
    tahun: [] 
  });

  useEffect(() => {
    let isMounted = true;
    
    // Mengambil master data filter untuk dropdown
    fetch('/api/filters')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(val => {
        if (isMounted) setListFilters(val);
      })
      .catch(err => {
        console.error("Gagal load filter master data:", err);
      });

    return () => { isMounted = false; };
  }, []);

  return (
    <main className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
              BSP Sales Dashboard
            </h1>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm w-fit border border-slate-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Update data terakhir: <span className="font-semibold text-slate-700">{lastUpdated || "--:--:--"}</span>
            </p>
          </div>

          <FilterBar
            selectedTahun={selectedTahun}
            setSelectedTahun={setSelectedTahun}
            selectedCabang={selectedCabang}
            setSelectedCabang={setSelectedCabang}
            selectedDivisi={selectedDivisi}
            setSelectedDivisi={setSelectedDivisi}
            listTahun={listFilters.tahun}
            listCabang={listFilters.cabang}
            listDivisi={listFilters.divisi}
          />
        </div>

        {/* --- ERROR STATE --- */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex items-center gap-4 shadow-sm animate-in fade-in slide-in-from-top-2">
            <div className="bg-red-100 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-red-800">Gangguan Koneksi</h3>
              <p className="text-xs text-red-600 font-medium">{error}</p>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-white hover:bg-red-50 text-red-700 text-xs font-bold py-2 px-4 border border-red-200 rounded-lg transition-all shadow-sm active:scale-95"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* --- MAIN CONTENT --- */}
        {isLoading ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SkeletonTable />
              <SkeletonTable />
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Kartu Ringkasan Angka */}
            <SummaryCards {...summary} trends={trends} />

            {/* Chart & Tabel Produk Terlaris */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <SalesChart data={data} />
              </div>
              <div className="lg:col-span-1">
                <TopProductsTable products={topProducts} />
              </div>
            </div>

            {/* Peta Distribusi */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Peta Sebaran Nasional</h2>
                  <p className="text-xs text-slate-500">Distribusi penjualan berdasarkan wilayah cabang</p>
                </div>
                <div className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded font-bold uppercase tracking-wider">
                  Live Map
                </div>
              </div>
              <div className="rounded-lg overflow-hidden border border-slate-50">
                <DistributionMap data={mapData} />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}