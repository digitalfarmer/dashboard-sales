import { Banknote, TrendingDown, CreditCard, Percent } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';

interface SummaryCardsProps {
  totalGross: number;
  totalRetur: number;
  totalNetto: number;
  returnRate: number;
}

interface CardProps {
  title: string;
  value: string;
  trend: number;
  gradient: string;
  accentColor: string;
  icon: React.ReactNode;
  isNegativeTrendBetter?: boolean; // Tambahan: buat retur, kalau turun malah bagus (hijau)
}

const Card = ({ title, value, trend, gradient, accentColor, icon, isNegativeTrendBetter }: CardProps) => {
  // Logika warna: biasanya naik itu hijau, tapi kalau Retur naik itu merah
  const isNeutral = trend === 0;
  const isPositive = trend > 0;

// 2. Tentukan Warna
  let trendColor = "bg-slate-100 text-slate-600"; // Default Netral (Abu-abu)
  
  if (!isNeutral) {
    if (isNegativeTrendBetter) {
      // Untuk Retur: Turun (-) itu Hijau, Naik (+) itu Merah
      trendColor = isPositive ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600';
    } else {
      // Untuk Sales/Netto: Naik (+) itu Hijau, Turun (-) itu Merah
      trendColor = isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600';
    }
  }

  return (
    // Tambahkan overflow-hidden dan relative supaya garis sampingnya rapi
    <div className={`relative overflow-hidden p-6 rounded-2xl shadow-sm border border-slate-100 ${gradient} backdrop-blur-sm transition-transform hover:scale-[1.02]`}>
      
      {/* GARIS AKSEN DI SAMPING KIRI (Versi Upgrade dari yang lama) */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${accentColor}`} />

      <div className="flex justify-between items-start pl-2"> {/* Kasih sedikit padding left agar tidak nempel garis */}
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{value}</h3>
        </div>
        <div className="p-2 bg-white/60 rounded-xl shadow-sm text-slate-600">
          {icon}
        </div>
      </div>
      
      <div className="mt-4 flex items-center gap-2 pl-2">
        <span className={`flex items-center text-[11px] font-bold px-2 py-0.5 rounded-full ${trendColor}`}>
          {isNeutral ? '●' : (isPositive ? '↑' : '↓')} {Math.abs(trend)}%
        </span>
        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
          {isNeutral ? 'Stagnan' : 'vs bulan lalu'}
        </span>
      </div>
    </div>
  );
  
};

export default function SummaryCards({ 
  totalGross, 
  totalRetur, 
  totalNetto, 
  returnRate ,
  trends
}: any) {
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card 
        title="Total Gross Sales"
        value={formatRupiah(totalGross)}
        trend={trends?.gross || 0} // Pakai data asli!
        gradient="bg-gradient-to-br from-blue-50/50 to-indigo-50/50"
        accentColor="bg-blue-500" // WARNA AKSEN KIRI
        icon={<Banknote size={20} />}
      />
      
      <Card 
        title="Netto Bersih"
        value={formatRupiah(totalNetto)}
        trend={trends?.netto || 0} //
        gradient="bg-gradient-to-br from-emerald-50/50 to-teal-50/50"
        accentColor="bg-emerald-500" // WARNA AKSEN KIRI
        icon={<CreditCard size={20} />}
      />

      <Card 
        title="Total Retur"
        value={formatRupiah(totalRetur)}
        trend={trends?.retur || 0} //
        isNegativeTrendBetter={true} // Kalau retur turun, warnanya jadi hijau
        gradient="bg-gradient-to-br from-orange-50/50 to-red-50/50"
        accentColor="bg-red-500" // WARNA AKSEN KIRI
        icon={<TrendingDown size={20} />}
      />

      <Card 
        title="Return Rate"
        value={`${returnRate.toFixed(2)}%`}
         trend={trends?.returnRate || 0} //
        isNegativeTrendBetter={true}
        gradient="bg-gradient-to-br from-slate-50/50 to-slate-100/50"
        accentColor="bg-slate-500" // WARNA AKSEN KIRI
        icon={<Percent size={20} />}
      />
    </div>
  );
}