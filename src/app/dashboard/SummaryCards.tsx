'use client'
import { TrendingUp, TrendingDown, DollarSign, FileText, RefreshCcw, Users } from 'lucide-react'

const stats = [
  { 
    label: 'Total Sales', 
    value: 'Rp 452.3M', 
    trend: '+12.5%', 
    up: true, 
    icon: DollarSign,
    color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400' 
  },
  { 
    label: 'Total Invoices', 
    value: '1,234', 
    trend: '+5.2%', 
    up: true, 
    icon: FileText,
    color: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400' 
  },
  { 
    label: 'Returns', 
    value: 'Rp 12.1M', 
    trend: '-2.4%', 
    up: false, 
    icon: RefreshCcw,
    color: 'text-rose-600 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400' 
  },
  { 
    label: 'Active Customers', 
    value: '890', 
    trend: '+10%', 
    up: true, 
    icon: Users,
    color: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400' 
  },
]

export default function SummaryCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((item) => (
        <div 
          key={item.label}
          // KUNCI DARK MODE ADA DI SINI:
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl ${item.color}`}>
              <item.icon className="size-6" />
            </div>
            <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${
              item.up ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600'
            }`}>
              {item.up ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
              {item.trend}
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{item.label}</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{item.value}</h3>
            <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-wider">vs last month</p>
          </div>
        </div>
      ))}
    </div>
  )
}