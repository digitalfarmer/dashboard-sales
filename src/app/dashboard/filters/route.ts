import { NextResponse } from 'next/server';
import { clickhouse } from '@/lib/clickhouse';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = JSON.parse(sessionCookie.value);
    const { role, kodeCabang } = user;

    // 1. Query Cabang - Kita ambil dari ClickHouse untuk SIAPAPUN yang login
    let branchQuery = "";
    if (role === 'SUPER_ADMIN') {
      branchQuery = `SELECT kode_cabang, nama_cabang FROM dbw_bsp_konsolidasi.dw_ms_cabang ORDER BY nama_cabang ASC`;
    } else {
      // Walaupun cuma satu cabang, kita tetep tanya ClickHouse biar dapet NAMA_CABANG-nya
      branchQuery = `SELECT kode_cabang, nama_cabang FROM dbw_bsp_konsolidasi.dw_ms_cabang WHERE kode_cabang = '${kodeCabang}' LIMIT 1`;
    }

     const [branchesRaw, principalQuery] = await Promise.all([
      clickhouse.query({ query: branchQuery, format: 'JSONEachRow' }).then(res => res.json()),
      clickhouse.query({ 
        query: `SELECT DISTINCT Kode_Principal as kode_principal, Nama_Principal as nama_principal 
                FROM dbw_bsp_konsolidasi.dw_ms_principal ORDER BY nama_principal ASC`, 
        format: 'JSONEachRow' 
      }).then(res => res.json())
    ]);

    // 3. Format Data Cabang
    // Pastikan kita mapping key-nya agar sesuai dengan yang diharapkan FilterBar (kodeCabang & fullName)
    // 2. Format Data Cabang
    let finalBranches = (branchesRaw as any[]).map(b => ({
      kodeCabang: b.kode_cabang,
      fullName: b.nama_cabang || b.kode_cabang // Kalau nama_cabang null, baru pake kode
    }));

    if (role === 'SUPER_ADMIN') {
      finalBranches.unshift({ kodeCabang: 'ALL', fullName: 'Semua Cabang' });
    }

    // 4. Generate List Tahun (2007 - Tahun Berjalan)
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = currentYear; y >= 2007; y--) {
      years.push(y.toString());
    }

    return NextResponse.json({
      branches: finalBranches,
      categories: principalQuery,
      years: years,
      defaultYear: currentYear.toString()
    });

  } catch (error: any) {
    console.error('Filter API Error:', error);
    return NextResponse.json({ 
      error: 'Gagal mengambil filter',
      details: error.message 
    }, { status: 500 });
  }
}