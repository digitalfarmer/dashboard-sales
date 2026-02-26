export const dynamic = 'force-dynamic';

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from 'next/navigation';
import PivotClient from '@/components/pivot/PivotClient';
import FilterBar from "@/components/dashboard/FilterBar";
import { Suspense } from 'react';

// IMPORT SERVICE DISINI
import { getPivotData } from '@/lib/pivot-service';

export default async function PivotPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect('/login');

  const user = session.user as any;
  const filters = await searchParams;

  const selectedBranch = user.kodeCabang !== 'ALL' ? user.kodeCabang : (filters.branch || 'ALL');
  const selectedYear = filters.year || new Date().getFullYear().toString();
  const selectedCategory = filters.category || 'ALL';

  // Panggil fungsi dari service
  const data = await getPivotData({
    branch: selectedBranch,
    category: selectedCategory,
    year: selectedYear
  });

  const cacheKey = JSON.stringify(filters);

  return (
    <div key={cacheKey} className="space-y-6">
      {/* HEADER & FILTER BAR TETAP SAMA */}
      <div className="flex justify-between items-center px-2">
        <h1 className="text-2xl font-black italic">PIVOT <span className="text-indigo-600">SALES</span></h1>
      </div>

      <Suspense fallback={<div className="h-16 animate-pulse bg-slate-100 rounded-full" />}>
        <FilterBar />
      </Suspense>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-xl border border-slate-100">
        {data && data.length > 0 ? (
          <PivotClient data={data} />
        ) : (
          <div className="py-20 text-center text-slate-400">Data tidak ditemukan.</div>
        )}
      </div>
    </div>
  );
}