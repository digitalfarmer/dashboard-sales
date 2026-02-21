"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area
} from "recharts";

export default function ChartSales({ data }: { data: any[] }) {
  // Fungsi untuk format angka ke Rupiah Jutaan/Miliaran agar sumbu Y tidak penuh angka nol
  const formatYAxis = (value: number) => {
    if (value >= 1e9) return `Rp ${(value / 1e9).toFixed(1)}M`;
    if (value >= 1e6) return `Rp ${(value / 1e6).toFixed(0)}jt`;
    return value.toLocaleString('id-ID');
  };

  return (
    <div className="w-full h-[450px] mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <defs>
            {/* Gradient untuk Netto agar terlihat premium */}
            <linearGradient id="colorNetto" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="fkmonth" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} tickFormatter={formatYAxis} />
          <Tooltip contentStyle={{ borderRadius: '16px', border: 'none' }} />
          <Legend verticalAlign="top" align="right" />

          {/* 1. GROSS (FAKTUR) - Bar Biru */}
          <Bar
            name="Gross (Faktur)"
            dataKey="total_faktur"
            fill="#3b82f6"
            radius={[6, 6, 0, 0]}
            barSize={40}
          />

          {/* 2. NETTO BERSIH - Area Hijau Transparan */}
          {/* Ini akan berada "di dalam" bar biru, menunjukkan selisihnya */}
          <Area
            name="Netto Bersih"
            type="monotone"
            dataKey="total_netto_bersih"
            fill="url(#colorNetto)"
            stroke="#10b981"
            strokeWidth={2}
          />

          {/* 3. RETUR - Line Merah */}
          <Line
            name="Total Retur"
            type="monotone"
            dataKey="total_retur"
            stroke="#f43f5e"
            strokeWidth={3}
            dot={{ r: 4, fill: '#f43f5e' }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}