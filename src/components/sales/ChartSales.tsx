'use client';

import { 
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

interface ChartSalesProps {
  data: any[];
}

export default function ChartSales({ data }: ChartSalesProps) {
  return (
    /* Hapus bg-white & shadow dari sini karena sudah ada di container luar (Parent) */
    <div className="w-full h-[450px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          {/* Grid: Garis bantu jadi redup di mode dark */}
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="#f1f5f9" 
            className="dark:stroke-slate-800" 
          />
          
          <XAxis 
            dataKey="fkmonth" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            tick={{ fill: '#64748b' }} // Warna abu-abu aman untuk dua mode
          />
          
          <YAxis 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            tick={{ fill: '#64748b' }}
            tickFormatter={(value) => `Rp${(value / 1e6).toFixed(0)}jt`}
          />
          
          {/* Tooltip: Kita buat transparan agar bisa diatur via CSS Global */}
          <Tooltip 
            cursor={{ fill: 'rgba(79, 70, 229, 0.05)' }}
            contentStyle={{ 
              borderRadius: '12px', 
              border: 'none', 
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
            }}
          />
          
          <Legend 
            verticalAlign="top" 
            align="right" 
            iconType="circle" 
            wrapperStyle={{ paddingBottom: '20px', fontSize: '12px' }} 
          />
          
          {/* Bar untuk Penjualan Kotor (Faktur) - Biru */}
          <Bar 
            dataKey="total_faktur" 
            name="Total Faktur" 
            fill="#3b82f6" 
            radius={[6, 6, 0, 0]} 
            barSize={30} 
          />
          
          {/* Bar untuk Retur - Merah */}
          <Bar 
            dataKey="total_retur" 
            name="Total Retur" 
            fill="#ef4444" 
            radius={[6, 6, 0, 0]} 
            barSize={30} 
          />
          
          {/* Line untuk Netto Bersih - Hijau */}
          <Line 
            type="monotone" 
            dataKey="total_netto_bersih" 
            name="Netto Bersih" 
            stroke="#10b981" 
            strokeWidth={4} 
            dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} 
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Trik CSS untuk Tooltip Recharts agar support Dark Mode */}
      <style jsx global>{`
        .recharts-default-tooltip {
          background-color: #ffffff !important;
          border: 1px solid #e2e8f0 !important;
        }
        .dark .recharts-default-tooltip {
          background-color: #0f172a !important; /* slate-900 */
          border: 1px solid #1e293b !important; /* slate-800 */
        }
        .dark .recharts-tooltip-item-list, 
        .dark .recharts-tooltip-label {
          color: #f8fafc !important;
        }
        .dark .recharts-legend-item-text {
          color: #94a3b8 !important;
        }
      `}</style>
    </div>
  );
}