import PivotClient from '@/components/pivot/PivotClient';
import { clickhouse } from '@/lib/clickhouse';

async function getPivotData() {
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
}

export default async function PivotPage() {
  const data = await getPivotData();

  return (
    <div className="space-y-6">
      {/* Header Ala Dashboard */}
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

      {/* Container Pivot yang Membulat Cantik */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <PivotClient data={data} />
      </div>
    </div>
  );
}