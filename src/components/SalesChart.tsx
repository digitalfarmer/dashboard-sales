"use client";

import React from 'react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, 
  Legend, LabelList 
} from 'recharts';

export default function SalesChart({ data }: { data: any[] }) {

  // 1. Formatter Sumbu Y & Label (Ringkas: jt, M, rb)
  const formatYAxis = (value: any): string => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;

    if (numValue === undefined || numValue === null || isNaN(numValue)) return "0";

    if (numValue >= 1000000000) return `${(numValue / 1000000000).toFixed(1)}M`;
    if (numValue >= 1000000) return `${(numValue / 1000000).toFixed(1)}jt`;
    if (numValue >= 1000) return `${(numValue / 1000).toFixed(0)}rb`;
    return numValue.toString();
  };

  // 2. Formatter Rupiah Lengkap (Tooltip)
  const formatRupiahTooltip = (value: any): string => {
    if (value === undefined || value === null) return "Rp 0";
    
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return "Rp 0";
    
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(numValue);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-auto min-h-[450px] mb-8">
      
      {/* KIRI: Trend Penjualan (Value) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-800">Performa Keuangan</h2>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Gross vs Netto Bersih</p>
        </div>
        
        <div className="flex-grow min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorGross" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorNetto" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="fkmonth" 
                tickFormatter={(v) => `Bln ${v}`} 
                axisLine={false}
                tickLine={false}
                tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 500}}
                dy={10}
              />
              <YAxis 
                tickFormatter={formatYAxis} 
                axisLine={false}
                tickLine={false}
                tick={{fill: '#94a3b8', fontSize: 11}}
                width={75}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                formatter={(value: any) => [formatRupiahTooltip(value), ""]}
              />
              <Legend verticalAlign="top" align="right" height={36} iconType="circle" />
              
              <Area
                type="monotone"
                dataKey="total_gross"
                name="Gross Sales"
                stroke="#3b82f6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorGross)"
              />
              <Area
                type="monotone"
                dataKey="total_netto_bersih"
                name="Netto Bersih"
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorNetto)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* KANAN: Volume Penjualan (Qty) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-800">Volume Penjualan</h2>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Quantity (Unit)</p>
        </div>

        <div className="flex-grow min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="fkmonth" 
                tickFormatter={(v) => `Bln ${v}`}
                axisLine={false}
                tickLine={false}
                tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 500}}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{fill: '#94a3b8', fontSize: 11}}
                tickFormatter={formatYAxis}
                width={60}
              />
              <Tooltip 
                cursor={{fill: '#f8fafc'}}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                formatter={(value: any) => [value?.toLocaleString('id-ID'), "Qty"]}
              />
              <Bar 
                dataKey="total_qty" 
                name="Total Qty" 
                fill="#6366f1" 
                radius={[6, 6, 0, 0]} 
                barSize={40}
              >
                <LabelList 
                  dataKey="total_qty" 
                  position="top"
                  formatter={(val: any) => formatYAxis(val)}
                  style={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} 
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}