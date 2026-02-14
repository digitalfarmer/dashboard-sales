'use client';
import Link from 'next/link';
import Image from 'next/image'; // Import komponen Image
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

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0">
      <div className="p-6">
       <div className="flex items-center gap-3 px-2 py-4 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100 mb-8">
          <div className="bg-white/20 p-2 rounded-lg">
            <BarChart3 className="text-white w-5 h-5" />
          </div>
          <span className="text-white font-black tracking-tight text-lg">BI-SYSTEM</span>
        
        </div>

        <nav className="space-y-1.5">
          {menus.map((menu) => {
            const isActive = pathname === menu.href;
            return (
              <Link
                key={menu.href}
                href={menu.href}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <menu.icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  {menu.name}
                </div>
                {isActive && <ChevronRight className="w-4 h-4" />}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-slate-100">
        <div className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-900 cursor-pointer">
          <Settings className="w-5 h-5" />
          <span className="text-sm font-semibold">Settings</span>
        </div>
      </div>
    </aside>
  );
}