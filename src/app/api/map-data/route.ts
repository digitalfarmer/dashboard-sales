import { clickhouse } from '@/lib/clickhouse';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tahun = searchParams.get('tahun');
  const cabang = searchParams.get('cabang');
  const divisi = searchParams.get('divisi');

  // Query dengan JOIN untuk mengambil Latitude & Longitude dari dw_ms_cabang
  let query = `
    SELECT 
        A.nama_cabang,
        sum(A.netto) as total_sales,
        B.geo_latitude,
        B.geo_longitude
    FROM dbw_bsp_konsolidasi.dw_vw_pivot_faktur_retur_nasional AS A
    LEFT JOIN dbw_bsp_konsolidasi.dw_ms_cabang AS B 
        ON A.kode_cabang = B.kode_cabang
    WHERE A.fkyear = ${tahun}
  `;

  // Tambahkan filter jika user memilih cabang tertentu
  if (cabang && cabang !== 'all') {
    query += ` AND A.kode_cabang = '${cabang}'`;
  }

  // Tambahkan filter jika user memilih divisi tertentu
  if (divisi && divisi !== 'all') {
    query += ` AND A.kode_divisi_produk = '${divisi}'`;
  }

  // Grouping berdasarkan nama dan koordinat
  query += ` 
    GROUP BY A.nama_cabang, B.geo_latitude, B.geo_longitude
    HAVING B.geo_latitude IS NOT NULL AND B.geo_longitude IS NOT NULL
  `;

  const resultSet = await clickhouse.query({ query, format: 'JSONEachRow' });
  const rawData: any[] = await resultSet.json();

  // Mapping hasil untuk dikirim ke Frontend
  const mappedData = rawData.map(item => ({
    nama_cabang: item.nama_cabang,
    total_sales: Number(item.total_sales),
    // Pastikan koordinat dikonversi ke angka (float)
    coords: [
        parseFloat(item.geo_latitude), 
        parseFloat(item.geo_longitude)
    ]
  }));

  return Response.json(mappedData);
}