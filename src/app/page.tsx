"use client"; // Ubah jadi client component agar bisa handle state dropdown
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import SalesChart from '@/components/SalesChart';
import { Filter, Package } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import FilterBar from '@/components/FilterBar';
import TopProductsTable from '@/components/TopProductsTable';
import SummaryCards from '@/components/SummaryCards';


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

  // Load Sales Data saat filter berubah
  useEffect(() => {
    fetch(`/api/sales-monthly?cabang=${selectedCabang}&divisi=${selectedDivisi}&tahun=${selectedTahun}`)
      .then(res => res.json())
      .then(setData);
  }, [selectedCabang, selectedDivisi, selectedTahun]);
  //  useEffect untuk fetch Top Products
  useEffect(() => {
    fetch(`/api/top-products?cabang=${selectedCabang}&divisi=${selectedDivisi}&tahun=${selectedTahun}`)
      .then(res => res.json())
      .then(setTopProducts);
  }, [selectedCabang, selectedDivisi, selectedTahun]);

  // useEffect untuk fetch Map Data
  useEffect(() => {
    fetch(`/api/map-data?cabang=${selectedCabang}&divisi=${selectedDivisi}&tahun=${selectedTahun}`)
      .then(res => res.json())
      .then(setMapData);
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

      </div>
    </main>
  );
}