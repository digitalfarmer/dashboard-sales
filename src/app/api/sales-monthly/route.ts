import { clickhouse } from '@/lib/clickhouse';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const currentDate = new Date();
    const currentYear: number = currentDate.getFullYear();

    console.log(currentYear);
    const { searchParams } = new URL(request.url);
    const cabang = searchParams.get('cabang');
    const divisi = searchParams.get('divisi');
    const tahun = searchParams.get('tahun')|| currentYear;

    let whereClause = `WHERE poyear = ${tahun}`;
    if (cabang && cabang !== 'all') whereClause += ` AND kode_cabang = '${cabang}'`;
    if (divisi && divisi !== 'all') whereClause += ` AND kode_divisi_produk = '${divisi}'`;

  try {
    const query = `
      SELECT 
          fkmonth,
          -- Kita konversi ke Float agar JSON aman
          toFloat64(SUM(netto)) as total_netto,
          toFloat64(SUM(qty_faktur)) as total_qty
      FROM dbw_bsp_konsolidasi.dw_vw_pivot_faktur_retur_nasional
      ${whereClause}
      GROUP BY fkmonth
      ORDER BY fkmonth ASC
    `;

    const resultSet = await clickhouse.query({
      query: query,
      format: 'JSONEachRow',
    });

    const data = await resultSet.json();
    
    return NextResponse.json(data);
  } catch (error: any) {
    // Ini akan menampilkan error asli di log terminal Next.js
    console.error("ClickHouse Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}