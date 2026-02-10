import { clickhouse } from '@/lib/clickhouse';
import { NextResponse } from 'next/server';

export async function GET() {
    
  try {
    // Ambil daftar cabang unik
    const cabangQuery = await clickhouse.query({
      query: `SELECT DISTINCT kode_cabang, nama_cabang FROM dw_vw_pivot_faktur_retur_nasional ORDER BY nama_cabang`,
      format: 'JSONEachRow',
    });
    
    // Ambil daftar divisi unik
    const divisiQuery = await clickhouse.query({
      query: `SELECT DISTINCT kode_divisi_produk FROM dw_vw_pivot_faktur_retur_nasional WHERE kode_divisi_produk != ''`,
      format: 'JSONEachRow',
    });

    //filter tahun
    const tahunQuery = await clickhouse.query({
      query: `SELECT DISTINCT fkyear FROM dw_vw_pivot_faktur_retur_nasional ORDER BY fkyear DESC`,
      format: 'JSONEachRow',
    });

    return NextResponse.json({
      cabang: await cabangQuery.json(),
      divisi: await divisiQuery.json(),
      tahun: await tahunQuery.json(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}