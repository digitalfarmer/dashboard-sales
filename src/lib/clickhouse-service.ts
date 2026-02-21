//query clickhouse buat dashboard yang ada login nya 
import { clickhouse } from './clickhouse';

export async function getSalesMonthlyMetrics(user: any, filters?: { branch?: string, category?: string, year?: string }) {
  // 1. Ambil nilai filter dari URL atau default ke user session
  const branchFilter = filters?.branch || user.kodeCabang;
  const categoryFilter = filters?.category || 'ALL';
  const yearFilter = filters?.year || new Date().getFullYear().toString(); // Default tahun berjalan

  // 2. Susun Query sesuai spek Masbro
  // Query ini jauh lebih enteng karena tidak pakai JOIN ke tabel master yang berat
  let query = `
    SELECT 
        fkmonth,
        toFloat64(SUM(IF(type = 'faktur', netto, 0))) as total_faktur,
        toFloat64(ABS(SUM(IF(type = 'retur', netto, 0)))) as total_retur,
        toFloat64(SUM(netto)) as total_netto_bersih,
        toFloat64(SUM(gross)) as total_gross,
        toFloat64(SUM(qty_terkecil)) as total_qty
    FROM (
        -- Ambil data faktur + JOIN minimal ke Master Barang
        SELECT f.fkmonth, f.netto, f.gross, f.qty_terkecil, f.kode_cabang, f.fkyear, 'faktur' as type, b.Kode_Principal as kode_principal
        FROM dbw_bsp_konsolidasi.dw_tr_sp_faktur AS f
        ANY LEFT JOIN dbw_bsp_konsolidasi.dw_ms_barang AS b ON f.kode_barang = b.kode_barang
        WHERE f.fkyear = ${yearFilter} AND f.flagsales = 'FAKTUR'

        UNION ALL

        -- Ambil data retur + JOIN minimal ke Master Barang
        SELECT r.fkmonth, r.netto, r.gross, r.qty_terkecil, r.kode_cabang, r.fkyear, 'retur' as type, b.Kode_Principal as kode_principal
        FROM dbw_bsp_konsolidasi.dw_tr_retur AS r
        ANY LEFT JOIN dbw_bsp_konsolidasi.dw_ms_barang AS b ON r.kode_barang = b.kode_barang
        WHERE r.fkyear = ${yearFilter} AND r.flagsales = 'RETUR'
    ) AS raw_data
    WHERE 1=1
`;

  // Filter sekarang aman karena kode_principal sudah ada di subquery
  if (branchFilter !== 'ALL') query += ` AND kode_cabang = '${branchFilter}'`;
  if (categoryFilter !== 'ALL') query += ` AND kode_principal = '${categoryFilter}'`;

  query += ` GROUP BY fkmonth ORDER BY fkmonth ASC`;

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
//buat query omset cabang per bulan
export async function getBranchMonthlyMatrix(year: string) {
  const query = `
    SELECT 
        nama_cabang,
        fkmonth,
        toFloat64(SUM(gross)) as total_gross
    FROM (
        SELECT f.fkmonth, f.gross, c.nama_cabang
        FROM dbw_bsp_konsolidasi.dw_tr_sp_faktur AS f
        ANY LEFT JOIN dbw_bsp_konsolidasi.dw_ms_cabang AS c ON f.kode_cabang = c.kode_cabang
        WHERE f.fkyear = ${year} AND f.flagsales = 'FAKTUR'
    )
    GROUP BY nama_cabang, fkmonth
    ORDER BY nama_cabang ASC, fkmonth ASC
  `;

  try {
    const rawData = await clickhouse.query({ query, format: 'JSONEachRow' }).then(res => res.json()) as any[];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

    // Group by Cabang
    const pivoted = rawData.reduce((acc: any[], curr) => {
      let branchObj = acc.find(item => item.cabang === curr.nama_cabang);
      if (!branchObj) {
        branchObj = { cabang: curr.nama_cabang, totalAll: 0 };
        acc.push(branchObj);
      }
      const monthLabel = monthNames[curr.fkmonth - 1];
      branchObj[monthLabel] = curr.total_gross;
      branchObj.totalAll += curr.total_gross; // Untuk sorting nanti
      return acc;
    }, []);

    // Sort biar cabang paling cuan ada di paling atas
    return pivoted.sort((a, b) => b.totalAll - a.totalAll);
  } catch (error) {
    console.error("Matrix Error:", error);
    return [];
  }
}


export async function getBranchPerformanceMetrics(filters: { branch: string, year: string, category: string }) {
  const { branch, year, category } = filters;
  const selectedYear = year || new Date().getFullYear().toString();

  // Kita definisikan kolom secara eksplisit di dalam subquery
  let query = `
    SELECT 
        fkmonth,
        coalesce(nama_cabang, kode_cabang) as display_name,
        kode_cabang,
        toFloat64(SUM(gross_val)) as total_gross
    FROM (
        SELECT 
            f.fkmonth AS fkmonth, 
            f.gross AS gross_val, 
            f.kode_cabang AS kode_cabang, 
            c.nama_cabang AS nama_cabang, 
            b.Kode_Principal AS kode_principal 
        FROM dbw_bsp_konsolidasi.dw_tr_sp_faktur AS f
        LEFT JOIN dbw_bsp_konsolidasi.dw_ms_cabang AS c ON f.kode_cabang = c.kode_cabang
        LEFT JOIN dbw_bsp_konsolidasi.dw_ms_barang AS b ON f.kode_barang = b.kode_barang
        WHERE f.fkyear = ${selectedYear} 
          AND lower(f.flagsales) = 'faktur'
    ) AS raw_data
    WHERE 1=1
  `;

  if (branch && branch !== 'ALL') query += ` AND kode_cabang = '${branch}'`;
  if (category && category !== 'ALL') query += ` AND kode_principal = '${category}'`;

  query += ` GROUP BY fkmonth, display_name, kode_cabang ORDER BY fkmonth ASC`;

  try {
    const resultSet = await clickhouse.query({ query, format: 'JSONEachRow' });
    const rawData = await resultSet.json() as any[];

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const pivotedData = monthNames.map(name => ({ month: name }));

    if (rawData.length > 0) {
      rawData.forEach(curr => {
        const monthIndex = curr.fkmonth - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
          // SEBELUMNYA: const label = `${curr.display_name} (${curr.kode_cabang})`;
          // SEKARANG: Cukup kode_cabang saja
          const label = curr.kode_cabang;
          pivotedData[monthIndex][label] = curr.total_gross;
        }
      });
    }

    return pivotedData;
  } catch (error) {
    // Log error asli ClickHouse agar kita tahu kolom mana yang bermasalah lagi
    console.error("CLICKHOUSE ERROR DETAIL:", error);
    return [];
  }
}