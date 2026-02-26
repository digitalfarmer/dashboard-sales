export const dynamic = 'force-dynamic';

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from 'next/navigation';
import PivotClient from '@/components/pivot/PivotClient';
import FilterBar from "@/components/dashboard/FilterBar";
import { Suspense } from 'react';

import { getPivotData } from '@/lib/pivot-service';

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
  const selectedYear = filters.year || new Date().getFullYear().toString();
  const selectedCategory = filters.category || 'ALL';

  
  const data = await getPivotData({
    branch: selectedBranch,
    category: selectedCategory,
    year: selectedYear
  });

  const FilterSkeleton = () => (
  <div className="flex gap-4 p-4 bg-white rounded-3xl animate-pulse">
    <div className="h-10 w-32 bg-slate-200 rounded-lg"></div>
    <div className="h-10 w-32 bg-slate-200 rounded-lg"></div>
  </div>
);

  const cacheKey = JSON.stringify(filters);
  return (
    <div key={cacheKey} className="space-y-6">
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
      <Suspense key={cacheKey} fallback={<FilterSkeleton />}>
        <FilterBar />
      </Suspense>

      {/* Main Content Area */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        {data && data.length > 0 ? (
          <PivotClient data={data} />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div>Loading data...</div>
            <p className="text-lg font-medium">Tidak ada data untuk filter ini</p>
            <p className="text-sm">Coba pilih tahun atau cabang lain.</p>
          </div>
        )}
      </div>
    </div>
  );
}