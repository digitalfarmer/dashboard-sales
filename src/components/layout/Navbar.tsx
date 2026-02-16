'use client';
import { useState, useEffect } from 'react';
import { logout } from '@/app/login/action'; 
import { 
  Menu, Search, Sun, Moon, Bell, 
  ChevronDown, LogOut, Command 
} from 'lucide-react';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';

export default function Navbar({ user, toggleSidebar }: { user: any; toggleSidebar: () => void }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 px-4">
      <nav className="flex items-center justify-between py-2">
        
        {/* KIRI */}
        <div className="flex items-center gap-4 lg:flex-1">
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
          >
            <Menu className="size-5" />
          </button>
          <div className="hidden md:flex flex-col">
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">BI-System</span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Executive Panel</span>
          </div>
        </div>

        {/* TENGAH */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-indigo-600" />
            <input 
              type="text" 
              placeholder="Cari data..." 
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-2 pl-10 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all dark:text-slate-200"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <kbd className="h-5 flex items-center gap-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-1.5 text-[10px] text-slate-400">
                <Command className="size-2.5" /> K
              </kbd>
            </div>
          </div>
        </div>

        {/* KANAN */}
        <div className="flex items-center gap-2 lg:flex-1 lg:justify-end">
          <button 
            onClick={() => setIsDark(!isDark)}
            className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
          >
            {isDark ? <Sun className="size-5 text-amber-500" /> : <Moon className="size-5" />}
          </button>

          <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all relative">
            <Bell className="size-5" />
            <span className="absolute top-2 right-2.5 size-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900"></span>
          </button>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>

          <Popover className="relative">
             <PopoverButton className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all focus:outline-none group">
                <div className="size-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                   {user?.fullName?.charAt(0)}
                </div>
                <ChevronDown className="size-4 text-slate-400 group-hover:text-slate-600" />
             </PopoverButton>
             
             <PopoverPanel className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl p-2 z-50">
                <div className="px-3 py-2 border-b border-slate-50 dark:border-slate-800 mb-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-200 truncate">{user?.fullName}</p>
                  <p className="text-[10px] text-slate-500">{user?.role}</p>
                </div>
                <form action={logout}>
                  <button className="w-full flex items-center gap-2 p-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl font-semibold transition-colors">
                    <LogOut className="size-4" /> Keluar
                  </button>
                </form>
             </PopoverPanel>
          </Popover>
        </div>

      </nav>
    </header>
  );
}