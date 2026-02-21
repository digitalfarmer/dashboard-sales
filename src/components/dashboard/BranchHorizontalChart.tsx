// src/components/dashboard/BranchHorizontalChart.tsx
"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend, Cell
} from "recharts";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
// Palet warna biru yang makin ke kanan makin tajam (Premium Look)
const COLORS = [
  "#e0f2fe", "#bae6fd", "#7dd3fc", "#38bdf8", 
  "#0ea5e9", "#0284c7", "#0369a1", "#075985", 
  "#0c4a6e", "#1e3a8a", "#172554", "#0f172a"
];

export default function BranchHorizontalChart({ data }: { data: any[] }) {
  return (
    <div className="w-full h-[600px] bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl transition-all duration-300 hover:shadow-2xl">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
            Revenue Performance Matrix
          </h3>
          <p className="text-slate-500 font-medium text-sm">Distribusi Gross Sales per Cabang & Bulan</p>
        </div>
        <div className="text-right hidden md:block">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Data Update: Real-time</span>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
          barCategoryGap="25%"
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
          
          <XAxis type="number" hide />
          
          <YAxis 
            dataKey="cabang" 
            type="category" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#1e293b', fontSize: 12, fontWeight: 800 }}
            width={120}
          />
          
          <Tooltip 
            cursor={{ fill: '#f8fafc', opacity: 0.4 }}
            contentStyle={{ 
              borderRadius: '20px', 
              border: 'none', 
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
              padding: '15px'
            }}
            itemSorter={(item) => Number(item.value) * -1} // Tooltip urut dari yang terbesar
            formatter={(value: number) => [
               new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value),
               ""
            ]}
          />
          
          <Legend 
            iconType="circle" 
            verticalAlign="bottom" 
            wrapperStyle={{ paddingTop: '30px', fontSize: '11px', fontWeight: 'bold' }}
          />

          {MONTHS.map((month, index) => (
            <Bar 
              key={month}
              dataKey={month} 
              stackId="a" 
              fill={COLORS[index]}
              // Efek rounded hanya di ujung bar (Desember)
              radius={index === 11 ? [0, 8, 8, 0] : [0, 0, 0, 0]}
              animationBegin={index * 100} // Efek waterfall animation
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}