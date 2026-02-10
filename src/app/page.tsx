"use client"; // Ubah jadi client component agar bisa handle state dropdown
import { useState, useEffect } from 'react';
import SalesChart from '@/components/SalesChart';
import { Banknote, Filter } from 'lucide-react';


export default function Dashboard() {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({ cabang: [], divisi: [] });
  const [selectedCabang, setSelectedCabang] = useState('all');
  const [selectedDivisi, setSelectedDivisi] = useState('all');
  const [selectedTahun, setSelectedTahun] = useState('2025');

  // Load Filter Options
  useEffect(() => {
    fetch('/api/filters').then(res => res.json()).then(setFilters);
  }, []);

  // Load Sales Data saat filter berubah
  useEffect(() => {
    fetch(`/api/sales-monthly?cabang=${selectedCabang}&divisi=${selectedDivisi}&tahun=${selectedTahun}`)
      .then(res => res.json())
      .then(setData);
  }, [selectedCabang, selectedDivisi, selectedTahun]);

  const totalNetto = data.reduce((acc, curr: any) => acc + Number(curr.total_netto), 0);

  return (
    <main className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">BSP Dashboard</h1>

          {/* Filter Bar */}
          <div className="flex gap-4 bg-white p-3 rounded-lg shadow-sm border">

            {/* Dropdown Tahun */}
            <div className="flex items-center gap-2 border-r pr-4">
              <span className="text-xs font-bold text-gray-400">TAHUN</span>
              <select
                className="text-sm border-none focus:ring-0 font-semibold"
                value={selectedTahun}
                onChange={(e) => setSelectedTahun(e.target.value)}
              >
                {filters.tahun?.map((t: any) => (
                  <option key={t.fkyear} value={t.fkyear}>{t.fkyear}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-400" />
              <select
                className="text-sm border-none focus:ring-0"
                onChange={(e) => setSelectedCabang(e.target.value)}
              >
                <option value="all">Semua Cabang</option>
                {filters.cabang.map((c: any) => (
                  <option key={c.kode_cabang} value={c.kode_cabang}>{c.nama_cabang}</option>
                ))}
              </select>
            </div>

            <select
              className="text-sm border-none focus:ring-0"
              onChange={(e) => setSelectedDivisi(e.target.value)}
            >
              <option value="all">Semua Divisi</option>
              {filters.divisi.map((d: any) => (
                <option key={d.kode_divisi_produk} value={d.kode_divisi_produk}>{d.kode_divisi_produk}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-600">
            <div className="flex items-center gap-4">
              <Banknote className="text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Netto {selectedCabang !== 'all' ? 'Cabang' : 'Nasional'}</p>
                <p className="text-xl font-bold font-mono">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalNetto)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <SalesChart data={data} />
      </div>
    </main>
  );
}