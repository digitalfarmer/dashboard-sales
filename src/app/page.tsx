"use client"; // Ubah jadi client component agar bisa handle state dropdown
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import SalesChart from '@/components/SalesChart';
import FilterBar from '@/components/FilterBar';
import TopProductsTable from '@/components/TopProductsTable';
import SummaryCards from '@/components/SummaryCards';
import { SkeletonCard, SkeletonTable } from '@/components/LoadingSkeleton';

// Dynamic import untuk DistributionMap agar tidak di-SSR
const DistributionMap = dynamic(() => import('@/components/DistributionMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full bg-gray-100 animate-pulse flex items-center justify-center rounded-xl">
      Prepare Peta Distribusi...
    </div>
  )
});
export default function Dashboard() {

  //buat loading
  const [isLoading, setIsLoading] = useState(true);

  //untuk error saat fetching api
  const [error, setError] = useState<string | null>(null);

  //get current year
  const currentYear = new Date().getFullYear().toString();

  const [data, setData] = useState([]);
  //const [filters, setFilters] = useState({ cabang: [], divisi: [], tahun: [] });
  const [topProducts, setTopProducts] = useState([]);
  const [mapData, setMapData] = useState([]);

  const [selectedTahun, setSelectedTahun] = useState(currentYear);
  const [selectedCabang, setSelectedCabang] = useState('all');
  const [selectedDivisi, setSelectedDivisi] = useState('all');

  const [listCabang, setListCabang] = useState([]);
  const [listDivisi, setListDivisi] = useState([]);
  const [listTahun, setListTahun] = useState([]);

  const totalGross = data.reduce((acc, curr: any) => acc + Number(curr.total_gross), 0);
  const totalRetur = data.reduce((acc, curr: any) => acc + Number(curr.total_retur), 0);
  const totalNetto = data.reduce((acc, curr: any) => acc + Number(curr.total_netto_bersih), 0);
  const returnRate = totalGross !== 0 ? (totalRetur / totalGross) * 100 : 0;


  useEffect(() => {
    // Fetch data master untuk filter dropdown
    const fetchFilters = async () => {
      try {
        const res = await fetch('/api/filters');
        const data = await res.json();
        setListCabang(data.cabang || []);
        setListDivisi(data.divisi || []);
        setListTahun(data.tahun || []);
      } catch (err) {
        console.error("Gagal load filter:", err);
      }
    };

    fetchFilters();
  }, []);


  // Load All Data saat filter berubah
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true); // Mulai loading
      setError(null);//reset error tiap ganti filter

      try {
        const responses = await Promise.all([
        fetch(`/api/sales-monthly?cabang=${selectedCabang}&divisi=${selectedDivisi}&tahun=${selectedTahun}`),
        fetch(`/api/top-products?cabang=${selectedCabang}&divisi=${selectedDivisi}&tahun=${selectedTahun}`),
        fetch(`/api/map-data?cabang=${selectedCabang}&divisi=${selectedDivisi}&tahun=${selectedTahun}`)
      ]);

      for (const res of responses) {
        if (!res.ok) throw new Error(`Server error: ${res.statusText}`);
      }
        const [salesData, topData, mapData] = await Promise.all(responses.map(r => r.json()));

        setData(salesData);
        setTopProducts(topData);
        setMapData(mapData);
      } catch (err:any) {
        console.error("Fetch error:", err);
        setError(err.message || "Gagal mengambil data dari server.");
      } finally {
        setIsLoading(false); // Selesai loading
      }
    };

    fetchAllData();
  }, [selectedCabang, selectedDivisi, selectedTahun]);

  return (
    <main className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">BSP Dashboard</h1>

          {/* Filter Bar */}
          <div >
            <FilterBar
              selectedTahun={selectedTahun}
              setSelectedTahun={setSelectedTahun}
              selectedCabang={selectedCabang}
              setSelectedCabang={setSelectedCabang}
              selectedDivisi={selectedDivisi}
              setSelectedDivisi={setSelectedDivisi}
              listTahun={listTahun}
              listCabang={listCabang}
              listDivisi={listDivisi}
            />

          </div>
        </div>

                {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex items-center gap-3">
            <div className="text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-red-800">Ups! Ada Masalah</h3>
              <p className="text-xs text-red-600">{error}. Coba refresh halaman atau ganti filter.</p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="ml-auto bg-red-100 hover:bg-red-200 text-red-800 text-xs font-bold py-1.5 px-3 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {isLoading ? (
          <>
            {/* Tampilan saat Loading */}
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
            {/* Tampilan saat Data Ready (Komponen Asli Kamu) */}
            <SummaryCards
              totalGross={totalGross}
              totalRetur={totalRetur}
              totalNetto={totalNetto}
              returnRate={returnRate}
            />

            {/* sales chart data */}
            <SalesChart data={data} />

            {/* Komponen Tabel Produk */}
            <TopProductsTable products={topProducts} />

            {/* --- PANGGIL KOMPONENNYA DI SINI --- */}
            <div className="mt-8 bg-white p-4 rounded-xl shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Peta Sebaran Nasional</h2>
              <DistributionMap data={mapData} />
            </div>
          </>
        )}

      </div>
    </main>
  );
}