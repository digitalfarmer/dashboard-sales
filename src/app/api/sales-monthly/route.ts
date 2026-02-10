import { clickhouse } from '@/lib/clickhouse';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const currentDate = new Date();
  const currentYear: number = currentDate.getFullYear();

  console.log(currentYear);
  const { searchParams } = new URL(request.url);
  const cabang = searchParams.get('cabang');
  const divisi = searchParams.get('divisi');
  const tahun = searchParams.get('tahun') || currentYear;

  let whereClause = `WHERE fkyear = ${tahun}`;
  if (cabang && cabang !== 'all') whereClause += ` AND kode_cabang = '${cabang}'`;
  if (divisi && divisi !== 'all') whereClause += ` AND kode_divisi_produk = '${divisi}'`;

  try {
    
    const query = `
                SELECT 
                    fkmonth,
                    -- 1. Total Penjualan Kotor (Hanya Faktur)
                    toFloat64(SUM(IF(jenis_faktur = 'FAKTUR', netto, 0))) as total_faktur,
                    
                    -- 2. Total Retur (Hanya Retur, di-absolutkan agar positif untuk grafik)
                    toFloat64(abs(SUM(IF(jenis_faktur = 'RETUR', netto, 0)))) as total_retur,
                    
                    -- 3. Total Netto Bersih  
                    -- Catatan:  retur sudah minus
                    toFloat64(SUM(netto)) as total_netto_bersih,

                    -- 4. Total Gross 
                    -- Catatan: nilai retur sudah minur
                    toFloat64(SUM(gross)) as total_gross,
                    
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