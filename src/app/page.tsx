"use client"; // Ubah jadi client component agar bisa handle state dropdown
import { useState, useEffect } from 'react';
import SalesChart from '@/components/SalesChart';
import { Banknote, Filter, Package } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';


export default function Dashboard() {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({ cabang: [], divisi: [], tahun: [] });
  const [selectedCabang, setSelectedCabang] = useState('all');
  const [selectedDivisi, setSelectedDivisi] = useState('all');
  const [selectedTahun, setSelectedTahun] = useState('2025');
  const [topProducts, setTopProducts] = useState([]);

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
  //  useEffect untuk fetch Top Products
  useEffect(() => {
    fetch(`/api/top-products?cabang=${selectedCabang}&divisi=${selectedDivisi}&tahun=${selectedTahun}`)
      .then(res => res.json())
      .then(setTopProducts);
  }, [selectedCabang, selectedDivisi, selectedTahun]);


  const totalGross = data.reduce((acc, curr: any) => acc + Number(curr.total_gross), 0);
  const totalRetur = data.reduce((acc, curr: any) => acc + Number(curr.total_retur), 0);
  const totalNetto = data.reduce((acc, curr: any) => acc + Number(curr.total_netto_bersih), 0);

  // Return Rate  dihitung dari (Retur / Gross)
  const returnRate = totalGross !== 0 ? (totalRetur / totalGross) * 100 : 0;

  return (
    <main className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">BSP Dashboard</h1>

          {/* Filter Bar */}
          <div className="flex gap-4 bg-white p-3 rounded-lg shadow-sm border">

            {/* Dropdown Tahun */}
            <div className="flex items-center gap-2 border-r pr-4">
              <span className="text-xs font-bold text-gray-400"></span>
              <select
                className="text-sm border-none focus:ring-0 font-semibold"
                value={selectedTahun}
                onChange={(e) => setSelectedTahun(e.target.value)}
              >
                {/* Ambil dari state filters yang diisi oleh API */}
                {filters.tahun?.map((year) => (
                  <option key={year} value={year}>
                    Tahun {year}
                  </option>
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
                {/* Perhatikan tanda ? sebelum .map */}
                {filters.cabang?.map((c: any) => (
                  <option key={c.kode_cabang} value={c.kode_cabang}>
                    {c.nama_cabang}
                  </option>
                ))}
              </select>
            </div>

            <select
              className="text-sm border-none focus:ring-0"
              onChange={(e) => setSelectedDivisi(e.target.value)}
            >
              <option value="all">Semua Divisi</option>
              {filters.divisi?.map((d: any) => (
                <option key={d.kode_divisi_produk} value={d.kode_divisi_produk}>
                  {d.kode_divisi_produk}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary Card */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Card 1: Penjualan Kotor */}
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
            <p className="text-sm text-gray-500 font-medium">Total Gross Sales</p>
            <p className="text-xl font-bold text-gray-800">{formatRupiah(totalGross)}</p>
          </div>

          {/* Card 2: Nilai Retur */}
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500">
            <p className="text-sm text-gray-500 font-medium">Total Retur</p>
            <p className="text-xl font-bold text-red-600">{formatRupiah(totalRetur)}</p>
          </div>

          {/* Card 3: Netto Bersih (Hasil Akhir) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-600">
            <p className="text-sm text-gray-500 font-medium">Netto Bersih</p>
            <p className="text-xl font-bold text-blue-700">{formatRupiah(totalNetto)}</p>
          </div>

          {/* Card 4: Return Rate (%) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-500">
            <p className="text-sm text-gray-500 font-medium">Return Rate</p>
            <p className="text-xl font-bold text-orange-600">{returnRate.toFixed(2)}%</p>
          </div>
        </div>

        {/* sales chart data */}
        <SalesChart data={data} />

        {/* Top Products Table */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Package size={20} />
            </div>
            <h2 className="text-xl font-bold">Top 10 Produk (Gross Sales)</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-sm border-b">
                  <th className="pb-3 font-medium">NAMA PRODUK</th>
                  <th className="pb-3 font-medium text-right">QTY</th>
                  <th className="pb-3 font-medium text-right">TOTAL GROSS</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {/* Tambahkan Array.isArray() untuk memastikan keamanan data */}
                {Array.isArray(topProducts) && topProducts.map((prod: any, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 text-sm font-semibold text-gray-700">
                      <span className="text-gray-400 mr-2">{index + 1}.</span>
                      {prod.nama_barang}
                    </td>
                    <td className="py-4 text-sm text-right font-mono">
                      {new Intl.NumberFormat('id-ID').format(prod.total_qty)}
                    </td>
                    <td className="py-4 text-sm text-right font-bold text-blue-600">
                      {formatRupiah(prod.total_gross)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}