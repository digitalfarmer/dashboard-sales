"use client";
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import SalesChart from '@/components/SalesChart';
import { useDashboardData } from '@/hooks/useDashboardData';
import FilterBar from '@/components/FilterBar';
import TopProductsTable from '@/components/TopProductsTable';
import SummaryCards from '@/components/SummaryCards';
import { SkeletonCard, SkeletonTable } from '@/components/LoadingSkeleton';

const DistributionMap = dynamic(() => import('@/components/DistributionMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full bg-gray-100 animate-pulse flex items-center justify-center rounded-xl">
      Prepare Peta Distribusi...
    </div>
  )
});

export default function Dashboard() {
  const currentYear = new Date().getFullYear().toString();

  const [selectedTahun, setSelectedTahun] = useState(currentYear);
  const [selectedCabang, setSelectedCabang] = useState('all');
  const [selectedDivisi, setSelectedDivisi] = useState('all');

  // Logic fetching & kalkulasi summary sudah dipindah ke sini
  const { data, topProducts, mapData, isLoading, error, summary, trends, lastUpdated } =
    useDashboardData(selectedTahun, selectedCabang, selectedDivisi);

  // State untuk dropdown filter (Master Data)
  const [listFilters, setListFilters] = useState({ cabang: [], divisi: [], tahun: [] });

  useEffect(() => {
    fetch('/api/filters')
      .then(res => res.json())
      .then(setListFilters)
      .catch(err => console.error("Gagal load filter:", err));
  }, []);

  return (
    <main className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* Judul & Filter Bar */}
        <div className="flex justify-between items-start mb-8">
          {/* Bungkus Judul dan Indikator jadi satu grup */}
          <div>
            <h1 className="text-3xl font-bold text-slate-800">BSP Dashboard</h1>

            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Update terakhir: {lastUpdated || "--:--:--"}
            </p>
          </div>

          {/* FilterBar akan otomatis terdorong ke kanan karena justify-between */}
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

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex items-center gap-3">
            <div className="text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-red-800">Ups! Ada Masalah</h3>
              <p className="text-xs text-red-600">{error}.</p>
            </div>
            <button onClick={() => window.location.reload()} className="ml-auto bg-red-100 hover:bg-red-200 text-red-800 text-xs font-bold py-1.5 px-3 rounded-lg transition-colors">
              Retry
            </button>
          </div>
        )}

        {isLoading ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SkeletonTable />
              <SkeletonTable />
            </div>
          </>
        ) : (
          <>
            {/* Gunakan {...summary} untuk mengoper hasil kalkulasi dari hook */}
            <SummaryCards {...summary} trends={trends} />

            {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6"> */}
            <SalesChart data={data} />
            <TopProductsTable products={topProducts} />
            {/* </div> */}

            <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h2 className="text-lg font-semibold mb-4 text-slate-700">Peta Sebaran Nasional</h2>
              <DistributionMap data={mapData} />
            </div>
          </>
        )}
      </div>
    </main>
  );
}