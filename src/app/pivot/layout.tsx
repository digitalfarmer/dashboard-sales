"use client";
import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar'; // Sesuaikan path-nya

export default function PivotLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar tetap di kiri */}
      <Sidebar isOpen={isSidebarOpen} />
      
      {/* Konten utama di kanan */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}