import { clickhouse } from '@/lib/clickhouse';
import { NextResponse } from 'next/server';

export async function GET() {
    
  try {
    
    const queryCabang = `
      SELECT DISTINCT kode_cabang, nama_cabang 
      FROM dbw_bsp_konsolidasi.dw_vw_pivot_faktur_retur_nasional WHERE fkyear = 2024 ORDER BY nama_cabang
      LIMIT 100
    `;
    
    const queryDivisi = `
      SELECT DISTINCT kode_divisi_produk 
      FROM dbw_bsp_konsolidasi.dw_vw_pivot_faktur_retur_nasional WHERE fkyear = 2024
      LIMIT 100
    `;

    //filter tahun
    const currentYear = new Date().getFullYear();
    const startYear = 2007;
    const years = [];
    for (let y = currentYear; y >= startYear; y--) {
      years.push(y.toString());
    }

    const [resCabang, resDivisi] = await Promise.all([
      clickhouse.query({ query: queryCabang, format: 'JSONEachRow' }),
      clickhouse.query({ query: queryDivisi, format: 'JSONEachRow' })
    ]);

    return NextResponse.json({
      tahun: years, // Dikirim sebagai array string
      cabang: await resCabang.json(),
      divisi: await resDivisi.json()
    });
  } catch (error: any) {
    console.error("Filter API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}