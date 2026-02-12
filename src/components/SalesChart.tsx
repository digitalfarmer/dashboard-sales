"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { formatRupiah } from '@/lib/utils';

export default function SalesChart({ data }: { data: any[] }) {

  // Fungsi Helper untuk format Rupiah
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Fungsi Singkatan (Misal: 1M untuk 1 Miliar)
  const formatYAxis = (value: number) => {
    if (value >= 1000000000) return `Rp ${(value / 1000000000).toFixed(1)}M`;
    if (value >= 1000000) return `Rp ${(value / 1000000).toFixed(1)}jt`;
    return `Rp ${value}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[500px]">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Trend Penjualan Netto</h2>
        <ResponsiveContainer width="100%" height="90%">

          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="fkmonth" tickFormatter={(v) => `Bulan ${v}`} />
            <YAxis tickFormatter={formatYAxis} width={80} />
            <Tooltip formatter={(val: number | any) => formatRupiah(val || 0)} />
            <Legend verticalAlign="top" height={40} />

            {/* Garis Gross: Menggunakan total_gross dari query baru kamu */}
            <Line
              type="monotone"
              dataKey="total_gross"
              name="Gross Sales"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 4 }}
            />

            {/* Garis Netto: Hasil akhir setelah dipotong retur/potongan */}
            <Line
              type="monotone"
              dataKey="total_netto_bersih"
              name="Netto Bersih"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Qty tetap gunakan angka biasa */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Volume Penjualan (Qty)</h2>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="fkmonth" tickFormatter={(value) => `Bulan ${value}`} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total_qty" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}