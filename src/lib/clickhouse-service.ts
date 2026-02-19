//query clickhouse buat dashboard yang ada login nya 
import { clickhouse } from './clickhouse';

export async function getSalesMonthlyMetrics(user: any, filters?: { branch?: string, category?: string,year?: string }) {
  // 1. Ambil nilai filter dari URL atau default ke user session
  const branchFilter = filters?.branch || user.kodeCabang;
  const categoryFilter = filters?.category || 'ALL';
  const yearFilter = filters?.year || new Date().getFullYear().toString(); // Default tahun berjalan

  // 2. Susun Query sesuai spek Masbro
  let query = `
    SELECT 
        fkmonth,
        -- 1. Total Penjualan Kotor (Hanya Faktur)
        toFloat64(SUM(IF(jenis_faktur = 'FAKTUR', netto, 0))) as total_faktur,
        
        -- 2. Total Retur (di-absolutkan agar positif untuk grafik)
        toFloat64(abs(SUM(IF(jenis_faktur = 'RETUR', netto, 0)))) as total_retur,
        
        -- 3. Total Netto Bersih (Faktur + Retur)
        toFloat64(SUM(netto)) as total_netto_bersih,

        -- 4. Total Gross
        toFloat64(SUM(gross)) as total_gross,
        
        -- 5. Total Qty
        toFloat64(SUM(qty_faktur)) as total_qty
    FROM dbw_bsp_konsolidasi.dw_vw_pivot_faktur_retur_nasional
    WHERE fkyear = ${yearFilter} AND 1=1
  `;

  // Logika Filter Cabang (Jika SUPER_ADMIN pilih 'ALL', tidak perlu filter kode_cabang)
  if (branchFilter !== 'ALL') {
    query += ` AND kode_cabang = '${branchFilter}'`;
  }

  // Logika Filter Principal/Category
  if (categoryFilter !== 'ALL') {
    // Sesuaikan case-sensitive kolom Kode_Principal jika perlu
    query += ` AND kode_principal = '${categoryFilter}'`;
  }

  // Grouping bulanan
  query += ` 
    GROUP BY fkmonth 
    ORDER BY fkmonth ASC
  `;

  try {
    const resultSet = await clickhouse.query({
      query: query,
      format: 'JSONEachRow',
    });
    
    const dataset = await resultSet.json();
    return dataset as any[];
  } catch (error: any) {
    console.error("ClickHouse Query Error:", error.message);
    // Return array kosong agar halaman dashboard tidak crash/putih
    return []; 
  }
}