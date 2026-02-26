// src/lib/pivot-service.ts
import { clickhouse } from '@/lib/clickhouse';

export async function getPivotData(filters: { branch: string; category: string; year: string }) {
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
          sum(toFloat64(gross)) as total_gross,
          sum(toFloat64(netto)) as total_netto
      FROM dbw_bsp_konsolidasi.dw_vw_pivot_faktur_retur_nasional
      WHERE ${whereClause}
      GROUP BY nama_cabang, kode_principal, fkmonth
      ORDER BY nama_cabang ASC
    `;

    const resultSet = await clickhouse.query({ query, format: 'JSONEachRow' });
    return await resultSet.json();
  } catch (error: any) {
    console.error("Pivot Service Error:", error.message);
    return [];
  }
}