export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from 'next/navigation';
import PivotClient from '@/components/pivot/PivotClient';
import FilterBar from "@/components/dashboard/FilterBar";
import { Suspense } from 'react';

import { getPivotData } from '@/lib/pivot-service';

async function PivotDataLoader({ filters }: { filters: any }) {
  const data = await getPivotData(filters);
  const pivotKey = `${filters.branch}-${filters.year}-${filters.category}-${Date.now()}`;

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <p className="text-lg font-medium">Tidak ada data untuk filter ini</p>
        <p className="text-sm">Coba pilih tahun atau cabang lain.</p>
      </div>
    );
  }
  return <PivotClient key={pivotKey} data={data} dataKey={pivotKey} />;
}

export default async function PivotPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect('/login');

  const user = session.user as any;
  const filters = await searchParams; // Pastikan di-await

  const selectedBranch = user.kodeCabang !== 'ALL' ? user.kodeCabang : (filters.branch || 'ALL');
  const selectedYear = filters.year || '2026';
  const selectedCategory = filters.category || 'ALL';

  console.log('Pivot Page Filters:', { selectedBranch, selectedYear, selectedCategory });

  // const data = await getPivotData({
  //   branch: selectedBranch,
  //   category: selectedCategory,
  //   year: selectedYear
  // });
  const filterParams = {
    branch: selectedBranch,
    year: selectedYear,
    category: selectedCategory
  };


  const pivotKey = `${selectedBranch}-${selectedYear}-${selectedCategory}-${Date.now()}`;
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center px-2">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight italic">
            PIVOT <span className="text-indigo-600">SALES</span>
          </h1>
          <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">
            {selectedBranch} — {selectedYear}
          </p>
        </div>

        {/* Indikator Tahun Aktif */}
        <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400">Data Year: </span>
          <span className="text-xs font-black text-indigo-600">{selectedYear}</span>
        </div>
      </div>

      {/* Filter Bar */}
      <Suspense fallback={
        <div className="flex gap-4 p-4 bg-white rounded-3xl animate-pulse">
          <div className="h-10 w-32 bg-slate-200 rounded-lg"></div>
          <div className="h-10 w-32 bg-slate-200 rounded-lg"></div>
        </div>
      }>
        <FilterBar />
      </Suspense>

      {/* Main Content Area - Bagian yang "Menunggu" Data */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <Suspense
          key={JSON.stringify(filterParams)} // Penting: Biar loading muncul tiap filter ganti
          fallback={
            <div className="flex flex-col items-center justify-center py-20">
              {/* Container Spinner */}
              <div className="relative size-16 mb-6">
                {/* Ring Dasar (Mati) */}
                <div className="absolute inset-0 border-4 border-slate-100 dark:border-slate-800 rounded-full"></div>

                {/* Ring Aktif (Berputar) - Menggunakan Warna Brand Indigo */}
                <div className="absolute inset-0 border-4 border-transparent border-t-indigo-600 border-l-indigo-600 rounded-full animate-spin"></div>
              </div>

              {/* Teks Loading yang Selaras */}
              <div className="text-center space-y-1">
                <p className="text-lg font-black text-slate-800 dark:text-white tracking-tight italic uppercase">
                  Processing <span className="text-indigo-600">Data</span>
                </p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] animate-pulse">
                  Connecting to ClickHouse
                </p>
              </div>
            </div>
          }
        >
          <PivotDataLoader filters={filterParams} />
        </Suspense>
      </div>
    </div>
  );
}