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


// src/lib/clickhouse-service.ts

export async function getPerformanceMetrics(user: any, filters: { branch: string, year: string, category: string }) {
  const { branch, year, category } = filters;
  
  // Jika ALL branch (Nasional), tampilkan nama_cabang
  // Jika sudah pilih Cabang, tampilkan kolom 'outlet' (isinya Kode + Nama)
  const targetColumn = branch === 'ALL' ? 'nama_cabang' : 'outlet';
  
  const branchFilter = branch !== 'ALL' ? `AND kode_cabang = '${branch}'` : '';
  const categoryFilter = category !== 'ALL' ? `AND kode_principal = '${category}'` : '';

  const baseQuery = `
    FROM dbw_bsp_konsolidasi.dw_vw_pivot_faktur_retur_nasional
    WHERE fkyear = ${year}
    ${branchFilter}
    ${categoryFilter}
  `;

  // Query Top 5
  const topQuery = `
    SELECT 
        ${targetColumn} as name, 
        toFloat64(sum(netto)) as total_netto 
    ${baseQuery} 
    GROUP BY name 
    ORDER BY total_netto DESC 
    LIMIT 5
  `;
  
  // Query Bottom 5
  const bottomQuery = `
    SELECT 
        ${targetColumn} as name, 
        toFloat64(sum(netto)) as total_netto 
    ${baseQuery} 
    GROUP BY name 
    HAVING total_netto > 0 
    ORDER BY total_netto ASC 
    LIMIT 5
  `;

  try {
    const [topRes, bottomRes] = await Promise.all([
      clickhouse.query({ query: topQuery, format: 'JSONEachRow' }).then(res => res.json()),
      clickhouse.query({ query: bottomQuery, format: 'JSONEachRow' }).then(res => res.json())
    ]);

    return {
      top: topRes as any[],
      bottom: bottomRes as any[],
      type: branch === 'ALL' ? 'Cabang' : 'Pelanggan'
    };
  } catch (error) {
    console.error("Performance Metrics Error:", error);
    return { top: [], bottom: [], type: '' };
  }
}