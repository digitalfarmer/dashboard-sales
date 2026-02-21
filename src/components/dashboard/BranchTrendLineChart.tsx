"use client";

import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#f43f5e", "#06b6d4", "#fb923c"];

export default function BranchTrendLineChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) return null;

  const branches = Array.from(
    new Set(data.flatMap(item => Object.keys(item)))
  ).filter(key => key !== 'month');

  // Logika Smart Chart: Jika cabang <= 3, pakai Area Chart biar lebih "Fresh"
  const isAreaChart = branches.length <= 3;
  const ChartComponent = isAreaChart ? AreaChart : LineChart;

  return (
    <div className="w-full h-[500px] bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl transition-all duration-500">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
            Branch Performance {isAreaChart ? "Focus" : "Trajectory"}
          </h3>
          <p className="text-slate-500 font-medium text-sm">Visualisasi tren gross sales</p>
        </div>
        {isAreaChart && (
          <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase">Focus View</span>
        )}
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <ChartComponent data={data} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
          <defs>
            {branches.map((branch, index) => (
              <linearGradient key={`grad-${branch}`} id={`color${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0}/>
              </linearGradient>
            ))}
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} />
          <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `Rp ${(v / 1e6).toFixed(0)}jt`} tick={{fill: '#94a3b8', fontSize: 12}} />

          <Tooltip 
            contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '15px' }}
            itemSorter={(item) => Number(item.value) * -1}
            formatter={(value: number, name: string) => [
              new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value),
              name
            ]}
          />
          <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />

          {branches.map((branch, index) => (
            isAreaChart ? (
              <Area
                key={branch}
                type="monotone"
                dataKey={branch}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={4}
                fillOpacity={1}
                fill={`url(#color${index})`}
                animationDuration={1500}
                connectNulls
              />
            ) : (
              <Line
                key={branch}
                type="monotone"
                dataKey={branch}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                animationDuration={1500}
                connectNulls
              />
            )
          ))}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
}