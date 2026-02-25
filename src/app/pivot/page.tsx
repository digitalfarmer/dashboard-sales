export const dynamic = 'force-dynamic';

import { unstable_noStore as noStore } from 'next/cache';
import PivotClient from '@/components/pivot/PivotClient';
import { clickhouse } from '@/lib/clickhouse';

async function getPivotData() {
  // Ini kunci utama: menghentikan static prerendering secara paksa
  noStore(); 

  try {
    const query = `
      SELECT 
          nama_cabang,
          kode_principal,
          fkmonth,
          sum(toFloat64(gross)) as total_gross,
          sum(toFloat64(netto)) as total_netto
      FROM dbw_bsp_konsolidasi.dw_vw_pivot_faktur_retur_nasional
      WHERE fkyear = 2026
      GROUP BY nama_cabang, kode_principal, fkmonth
      ORDER BY nama_cabang ASC
    `;
    
    const resultSet = await clickhouse.query({ query, format: 'JSONEachRow' });
    return await resultSet.json();
  } catch (error) {
    console.error("Build-time fetch skipped or failed:", error.message);
    // Return array kosong agar build tetap lanjut (tidak crash)
    return [];
  }
}

export default async function PivotPage() {
  const data = await getPivotData();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-2">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
            PIVOT SALES 
          </h1>
          <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">
            Advanced Data Exploration
          </p>
        </div>
        
        <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400">Tahun Data: </span>
          <span className="text-xs font-black text-indigo-600">2026</span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        {/* Pastikan data ada sebelum render client component */}
        {data && data.length > 0 ? (
          <PivotClient data={data} />
        ) : (
          <div className="text-center py-10 text-slate-500">
            <p>Memuat data dari ClickHouse...</p>
          </div>
        )}
      </div>
    </div>
  );
}