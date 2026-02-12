'use client';

import { Banknote, TrendingDown, CreditCard, Percent } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import React from 'react';

interface SummaryCardsProps {
  totalGross: number;
  totalRetur: number;
  totalNetto: number;
  returnRate: number;
  trends: any;
}

interface CardProps {
  title: string;
  value: string;
  trend: number;
  gradient: string;
  textColor: string;
  accentColor: string;
  icon: React.ReactNode;
  isNegativeTrendBetter?: boolean;
}

const Card = ({ title, value, trend, gradient, accentColor, textColor, icon, isNegativeTrendBetter }: CardProps) => {
  const isNeutral = trend === 0;
  const isPositive = trend > 0;

  // Logic Warna Tren
  let trendColor = "bg-slate-100 text-slate-600";
  if (!isNeutral) {
    if (isNegativeTrendBetter) {
      trendColor = isPositive ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600';
    } else {
      trendColor = isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600';
    }
  }

  return (
    /* GROUP: Kunci utama semua animasi hover */
    <div className={`group relative overflow-hidden p-5 rounded-2xl border border-slate-100 ${gradient} shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 cursor-pointer h-full flex flex-col justify-between backdrop-blur-sm`}>
      
      {/* 1. Garis samping yang menebal saat di-hover */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${accentColor} transition-all duration-300 group-hover:w-2`} />

      {/* 2. WATERMARK DI BACKGROUND: Gerak membesar & berputar pelan */}
      <div className="absolute -right-4 -top-4 opacity-[0.05] text-slate-900 transition-all duration-700 ease-in-out group-hover:opacity-10 group-hover:scale-150 group-hover:-rotate-12">
        {React.cloneElement(icon as React.ReactElement, { size: 100 })}
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-2">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
            {title}
          </p>
         
        </div>

        {/* 4. VALUE: Angka sedikit membesar (Zoom In) */}
        <h3 className={`font-extrabold tracking-tighter ${textColor} text-lg sm:text-xl lg:text-[22px] leading-tight transition-all duration-300 group-hover:scale-[1.03] origin-left`}>
          {value}
        </h3>
      </div>
      
      {/* 5. TANDA TREN */}
      <div className="relative z-10 mt-4 flex items-center gap-2">
        <span className={`flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full transition-all duration-300 ${trendColor} group-hover:shadow-md`}>
          {isNeutral ? '●' : (isPositive ? '↑' : '↓')} {Math.abs(trend)}%
        </span>
        <span className="text-[10px] text-slate-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          vs bln lalu
        </span>
      </div>
    </div>
  );
};

export default function SummaryCards({ 
  totalGross, 
  totalRetur, 
  totalNetto, 
  returnRate,
  trends
}: SummaryCardsProps) {
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card 
        title="Total Gross Sales"
        value={formatRupiah(totalGross)}
        trend={trends?.gross || 0}
        textColor="text-blue-700"
        gradient="bg-gradient-to-br from-blue-50/50 to-indigo-50/50"
        accentColor="bg-blue-500"
        icon={<Banknote />}
      />
      
      <Card 
        title="Netto Bersih"
        value={formatRupiah(totalNetto)}
        trend={trends?.netto || 0}
        textColor="text-emerald-700"
        gradient="bg-gradient-to-br from-emerald-50/50 to-teal-50/50"
        accentColor="bg-emerald-500"
        icon={<CreditCard />}
      />

      <Card 
        title="Total Retur"
        value={formatRupiah(totalRetur)}
        trend={trends?.retur || 0}
        isNegativeTrendBetter={true}
        gradient="bg-gradient-to-br from-orange-50/50 to-red-50/50"
        textColor="text-red-700"
        accentColor="bg-red-500"
        icon={<TrendingDown />}
      />

      <Card 
        title="Return Rate"
        value={`${returnRate.toFixed(2)}%`}
        trend={trends?.returnRate || 0}
        isNegativeTrendBetter={true}
        gradient="bg-gradient-to-br from-slate-50/50 to-slate-100/50"
        textColor="text-slate-700"
        accentColor="bg-slate-500"
        icon={<Percent />}
      />
    </div>
  );
}