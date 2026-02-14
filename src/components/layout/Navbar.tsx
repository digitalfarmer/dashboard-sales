'use client'
import { useState } from 'react'
import { logout } from '@/app/login/action'
import {
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react'
import {
  ChevronDownIcon,
  UserCircle,
  LogOut,
  Bell,
  HelpCircle,
  User,
  Settings as SettingsIcon
} from 'lucide-react'

const userMenus = [
  { name: 'My Profile', description: 'Cek data personal kamu', href: '#', icon: User },
  { name: 'Account Settings', description: 'Ganti password & keamanan', href: '#', icon: SettingsIcon },
  { name: 'Support', description: 'Butuh bantuan teknis?', href: '#', icon: HelpCircle },
]

export default function Navbar({ user }: { user: any }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <nav className="mx-auto flex items-center justify-between px-6 py-3">
        
        {/* SISI KIRI: Welcome Message */}
        <div className="flex lg:flex-1">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Working Area</span>
            <span className="text-sm font-bold text-slate-900">
               {user?.kodeCabang === 'ALL' ? 'Pusat (Head Office)' : `Regional Office ${user?.kodeCabang}`}
            </span>
          </div>
        </div>

        {/* SISI TENGAH: Menu Cepat (Opsional) */}
        <PopoverGroup className="hidden lg:flex lg:gap-x-8">
           <a href="#" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Help Desk</a>
           <a href="#" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Documentation</a>
        </PopoverGroup>

        {/* SISI KANAN: Notification & User Profile */}
        <div className="flex lg:flex-1 lg:justify-end items-center gap-4">
          <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors relative">
            <Bell className="size-5" />
            <span className="absolute top-2 right-2 size-2 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>

          <div className="h-6 w-px bg-slate-200 mx-2"></div>

          <Popover className="relative">
            <PopoverButton className="flex items-center gap-x-2 text-sm font-semibold text-gray-900 focus:outline-none group">
              <div className="size-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 border border-indigo-200 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <UserCircle className="size-5" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-bold leading-none">{user?.fullName}</p>
                <p className="text-[10px] text-slate-500 leading-none mt-1">{user?.role}</p>
              </div>
              <ChevronDownIcon className="size-4 text-gray-400" />
            </PopoverButton>

            <PopoverPanel
              transition
              className="absolute right-0 z-10 mt-3 w-screen max-w-xs overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-900/5 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
            >
              <div className="p-3">
                {userMenus.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="group relative flex items-center gap-x-4 rounded-xl p-3 text-sm hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex size-9 flex-none items-center justify-center rounded-lg bg-slate-50 group-hover:bg-white transition-colors">
                      <item.icon className="size-5 text-slate-600 group-hover:text-indigo-600" />
                    </div>
                    <div>
                      <span className="block font-semibold text-slate-900">{item.name}</span>
                      <p className="text-xs text-slate-500">{item.description}</p>
                    </div>
                  </a>
                ))}
              </div>
              
              <div className="bg-slate-50 p-3 border-t border-slate-100">
                <form action={logout}>
                  <button className="flex w-full items-center justify-center gap-x-2.5 rounded-xl p-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors">
                    <LogOut className="size-4" />
                    Logout Account
                  </button>
                </form>
              </div>
            </PopoverPanel>
          </Popover>
        </div>
      </nav>
    </header>
  )
}