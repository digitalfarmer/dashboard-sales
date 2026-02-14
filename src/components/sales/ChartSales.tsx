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
    <div className="w-full h-[450px] bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-800">Tren Performa Penjualan</h3>
        <p className="text-sm text-slate-500">Perbandingan Faktur, Retur, dan Netto Bersih</p>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="fkmonth" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            tick={{ fill: '#64748b' }}
          />
          <YAxis 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            tick={{ fill: '#64748b' }}
            tickFormatter={(value) => `Rp${(value / 1e6).toFixed(0)}jt`}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px' }} />
          
          {/* Bar untuk Penjualan Kotor (Faktur) */}
          <Bar dataKey="total_faktur" name="Total Faktur" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={35} />
          
          {/* Bar untuk Retur */}
          <Bar dataKey="total_retur" name="Total Retur" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={35} />
          
          {/* Line untuk Netto Bersih - Biar kelihatan tren-nya */}
          <Line 
            type="monotone" 
            dataKey="total_netto_bersih" 
            name="Netto Bersih" 
            stroke="#10b981" 
            strokeWidth={3} 
            dot={{ r: 5, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} 
            activeDot={{ r: 8 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}