"use client";

import {
    AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend
} from "recharts";

// Palet warna lebih variatif (14 warna premium)
const COLORS = [
    "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#f43f5e",
    "#06b6d4", "#fb923c", "#2dd4bf", "#a855f7", "#ec4899",
    "#6366f1", "#14b8a6", "#f97316", "#0ea5e9"
];

export default function BranchTrendLineChart({
    data,
    branchMap
}: {
    data: any[],
    branchMap: Record<string, string>
}) {
    if (!data || data.length === 0) return null;

    const branches = Array.from(
        new Set(data.flatMap(item => Object.keys(item)))
    ).filter(key => key !== 'month');

    const isAreaChart = branches.length <= 3;
    const ChartComponent = isAreaChart ? AreaChart : LineChart;

    return (
        <div className="w-full h-[550px] bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl">
            <div className="mb-6">
                <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                    Branch Performance {isAreaChart ? "Deep Dive" : "Overview"}
                </h3>
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <ChartComponent data={data} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
                    <defs>
                        {branches.map((kode, index) => (
                            <linearGradient key={`grad-${kode}`} id={`color${index}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.4} />
                                <stop offset="95%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0} />
                            </linearGradient>
                        ))}
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                    <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `Rp ${(v / 1e6).toFixed(0)}jt`} tick={{ fill: '#94a3b8', fontSize: 12 }} />

                    <Tooltip
                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '15px' }}
                        itemSorter={(item) => Number(item.value) * -1}
                        // TOOLTIP: Tetap tampilkan Kode Cabang
                        formatter={(value: number, name: string) => [
                            new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value),
                            name // Ini adalah Kode Cabang
                        ]}
                    />

                    <Legend
                        iconType="circle"
                        verticalAlign="bottom"
                        // LEGEND: Ubah Kode jadi Nama Lengkap
                        formatter={(value) => (
                            <span className="text-slate-600 dark:text-slate-300 font-bold text-xs">
                                {branchMap[value] || value}
                            </span>
                        )}
                        wrapperStyle={{ paddingTop: '30px' }}
                    />

                    {branches.map((kode, index) => (
                        isAreaChart ? (
                            <Area
                                key={kode}
                                type="monotone"
                                dataKey={kode}
                                stroke={COLORS[index % COLORS.length]}
                                strokeWidth={4}
                                fillOpacity={1}
                                fill={`url(#color${index})`}
                                animationDuration={1500}
                                connectNulls
                            />
                        ) : (
                            <Line
                                key={kode}
                                type="monotone"
                                dataKey={kode}
                                stroke={COLORS[index % COLORS.length]}
                                strokeWidth={3}
                                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                                activeDot={{ r: 6 }}
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