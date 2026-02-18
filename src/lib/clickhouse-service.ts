import { createClient } from '@clickhouse/client';

const client = createClient({
  host: process.env.CLICKHOUSE_HOST || 'http://localhost:8123',
  username: process.env.CLICKHOUSE_USER || 'default',
  password: process.env.CLICKHOUSE_PASSWORD || '',
//   clickhouse_settings: {
//     connect_timeout: 60,
//     request_timeout: 60
//   },
  keep_alive: {
    enabled: true
  }
});
export async function getSalesMonthlyMetrics(user: { role: string; kodeCabang: string }) {

  const currentYear = new Date().getFullYear();
  // 1. Susun whereClause dinamis
  // Jika Super Admin, tampilkan semua (tidak ada filter cabang)
  // Jika Cabang, filter berdasarkan kolom kode_cabang di view kamu
 let whereClause = `WHERE 1=1 and fkyear = '${currentYear}'`; // Default yang selalu benar  
 

if (user.role !== 'SUPER_ADMIN' && user.kodeCabang !== 'ALL') {
  // PASTIKAN nama kolom di view ClickHouse kamu memang 'kode_cabang'
  whereClause += ` AND kode_cabang = '${user.kodeCabang}' AND fkyear = '${currentYear}'`;
}
  // 2. Masukkan Query kamu yang sudah dipoles
  const query = `
    SELECT 
        t.fkmonth,
        -- Kita ambil nama cabang dari tabel master (pakai any atau max karena group by)
        any(m.nama_cabang) as nama_cabang, 
        
        toFloat64(SUM(IF(t.jenis_faktur = 'FAKTUR', t.netto, 0))) as total_faktur,
        toFloat64(abs(SUM(IF(t.jenis_faktur = 'RETUR', t.netto, 0)))) as total_retur,
        toFloat64(SUM(t.netto)) as total_netto_bersih,
        toFloat64(SUM(t.qty_faktur)) as total_qty
    FROM dbw_bsp_konsolidasi.dw_vw_pivot_faktur_retur_nasional AS t
    LEFT JOIN dbw_bsp_konsolidasi.dw_ms_cabang AS m ON t.kode_cabang = m.kode_cabang
    ${whereClause}
    GROUP BY t.fkmonth
    ORDER BY t.fkmonth ASC
  `;

  try {
    const resultSet = await client.query({
      query: query,
      format: 'JSONEachRow',
    });

    return await resultSet.json();
  } catch (error) {
    
    console.error("DEBUG CLICKHOUSE ERROR:", error); //
    throw new Error("Gagal mengambil data dari ClickHouse");
  }
}