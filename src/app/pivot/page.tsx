export const dynamic = 'force-dynamic';

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from 'next/navigation';
import PivotClient from '@/components/pivot/PivotClient';
import { clickhouse } from '@/lib/clickhouse';
import FilterBar from "@/components/dashboard/FilterBar";
import { Suspense } from 'react';

// Fungsi fetch data yang sekarang menerima parameter filter
async function getPivotData(filters: { branch: string; category: string; year: string }) {
  try {
    const { branch, category, year } = filters;

    // 1. Build Query dinamis berdasarkan Filter
    let whereConditions = [`fkyear = ${year}`];

    if (branch !== 'ALL') {
      whereConditions.push(`kode_cabang = '${branch}'`);
    }
    if (category !== 'ALL') {
      whereConditions.push(`kode_principal = '${category}'`);
    }

    const whereClause = whereConditions.join(' AND ');

    const query = `
      SELECT 
          nama_cabang,
          kode_principal,
          fkmonth,
          sum(gross) as total_gross,
          sum(netto) as total_netto
      FROM dbw_bsp_konsolidasi.dw_vw_pivot_faktur_retur_nasional
      WHERE ${whereClause}
      GROUP BY nama_cabang, kode_principal, fkmonth
      ORDER BY nama_cabang ASC
    `;
    console.log("RUNNING QUERY:", query); // <--- LIHAT DI TERMINAL VSCODE KAMU
    const resultSet = await clickhouse.query({ query, format: 'JSONEachRow' });
    return await resultSet.json();
  } catch (error: any) {
    console.error("Pivot Fetch Error:", error.message);
    return [];
  }
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

  // --- LOGIC PENENTUAN CABANG ---
  let selectedBranch = 'ALL';

  if (user.kodeCabang !== 'ALL') {
    // Jika user punya cabang spesifik, pakai kodenya dia
    selectedBranch = user.kodeCabang;
  } else {
    // Jika user PUSAT/SUPER_ADMIN, ambil dari URL ?branch=...
    // Kita kasih fallback 'ALL' kalau filters.branch nilainya null/undefined
    selectedBranch = filters.branch || 'ALL';
  }
//get currentyear
  const currentYear = new Date().getFullYear().toString();
  const selectedYear = filters.year || currentYear; // Pakai tahun saat ini jika tidak ada filter
  const selectedCategory = filters.category || 'ALL';

  // Debugging di Terminal VSCode
  console.log("DEBUG FILTERS:", { selectedBranch, selectedYear, selectedCategory });

  const data = await getPivotData({
    branch: selectedBranch,
    category: selectedCategory,
    year: selectedYear
  });
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
      <Suspense fallback={<div className="h-16 animate-pulse bg-slate-100 rounded-full" />}>
        <FilterBar />
      </Suspense>

      {/* Main Content Area */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        {data && data.length > 0 ? (
          <PivotClient data={data} />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <p className="text-lg font-medium">Tidak ada data untuk filter ini</p>
            <p className="text-sm">Coba pilih tahun atau cabang lain.</p>
          </div>
        )}
      </div>
    </div>
  );
}