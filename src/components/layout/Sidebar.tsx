'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BarChart3,
  Package,
  Users,
  Settings,
  ChevronRight,
  MapIcon
} from 'lucide-react';

const menus = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Sales Report', href: '/dashboard/sales', icon: BarChart3 },
  { name: 'Products', href: '/dashboard/products', icon: Package },
  { name: 'Customers', href: '/dashboard/customers', icon: Users },
  { name: 'Maps', href: '/dashboard/maps', icon: MapIcon },
];

export default function Sidebar({ isOpen }: { isOpen: boolean }) {
  const pathname = usePathname();

  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen transition-all duration-300 ease-in-out overflow-hidden
        ${isOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full lg:translate-x-0 lg:w-0'}
      `}
    >
      <div className="w-64 flex flex-col h-full">
        <div className="p-6">
          {/* LOGO */}
          <div className="flex items-center gap-3 px-2 py-4 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none mb-8">
            <div className="bg-white/20 p-2 rounded-lg">
              <BarChart3 className="text-white size-5" />
            </div>
            <span className="text-white font-black tracking-tight text-lg">BI-SYSTEM</span>
          </div>

          {/* MENUS */}
          <nav className="space-y-1.5">
            {menus.map((menu) => {
              const isActive = pathname === menu.href;
              return (
                <Link
                  key={menu.href}
                  href={menu.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <menu.icon className={`size-5 ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                    <span className="whitespace-nowrap">{menu.name}</span>
                  </div>
                  {isActive && <ChevronRight className="size-4" />}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer group transition-colors">
            <Settings className="size-5" />
            <span className="text-sm font-semibold">Settings</span>
          </div>
        </div>
      </div>
    </aside>
  );
}