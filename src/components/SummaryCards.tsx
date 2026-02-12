import { Banknote, TrendingDown, CreditCard, Percent } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';

interface SummaryCardsProps {
  totalGross: number;
  totalRetur: number;
  totalNetto: number;
  returnRate: number;
}

export default function SummaryCards({ 
  totalGross, 
  totalRetur, 
  totalNetto, 
  returnRate 
}: SummaryCardsProps) {
  
  const cards = [
    {
      title: "Total Gross Sales",
      value: formatRupiah(totalGross),
      icon: <Banknote size={20} />,
      colorClass: "border-green-500",
      textColor: "text-gray-800"
    },
    {
      title: "Total Retur",
      value: formatRupiah(totalRetur),
      icon: <TrendingDown size={20} />,
      colorClass: "border-red-500",
      textColor: "text-red-600"
    },
    {
      title: "Netto Bersih",
      value: formatRupiah(totalNetto),
      icon: <CreditCard size={20} />,
      colorClass: "border-blue-600",
      textColor: "text-blue-700"
    },
    {
      title: "Return Rate",
      value: `${returnRate.toFixed(2)}%`,
      icon: <Percent size={20} />,
      colorClass: "border-orange-500",
      textColor: "text-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {cards.map((card, index) => (
        <div 
          key={index} 
          className={`bg-white p-6 rounded-xl shadow-sm border-l-4 ${card.colorClass} transition-transform hover:scale-[1.02]`}
        >
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm text-gray-500 font-medium">{card.title}</p>
            <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
              {card.icon}
            </div>
          </div>
          <p className={`text-xl font-bold ${card.textColor}`}>{card.value}</p>
        </div>
      ))}
    </div>
  );
}