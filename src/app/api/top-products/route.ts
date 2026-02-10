// Set timeout jadi 60 detik (hanya berlaku di deployment tertentu seperti Vercel)
import { clickhouse } from '@/lib/clickhouse';
import { NextResponse } from 'next/server';


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cabang = searchParams.get('cabang');
  const divisi = searchParams.get('divisi');
  const tahun = searchParams.get('tahun') || '2025';

  let whereClause = `WHERE fkyear = ${tahun}`;
  if (cabang && cabang !== 'all') whereClause += ` AND kode_cabang = '${cabang}'`;
  if (divisi && divisi !== 'all') whereClause += ` AND kode_divisi_produk = '${divisi}'`;

  try {
    const query = `
  SELECT 
      nama_barang,
      toFloat64(sum(gross)) as total_gross,
      toFloat64(sum(qty_faktur)) as total_qty
  FROM dbw_bsp_konsolidasi.dw_vw_pivot_faktur_retur_nasional
  -- Pastikan filter TAHUN ada di paling atas untuk mempercepat scanning partition
  ${whereClause} 
  GROUP BY nama_barang
  ORDER BY total_gross DESC
  LIMIT 10
  -- Tambahkan SETTINGS untuk optimasi jika diperlukan
  
`;

    const resultSet = await clickhouse.query({ query, format: 'JSONEachRow' });
    const data = await resultSet.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}