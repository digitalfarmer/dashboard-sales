import { NextResponse } from 'next/server';
import { clickhouse } from '@/lib/clickhouse';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    // 1. Ambil session NextAuth (Gantiin Cookies manual)
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = session.user as any;
    const { role, kodeCabang } = user;

    // 2. Query Cabang
    let branchQuery = "";
    // Sesuaikan role dengan enum di Postgres kamu (misal: 'ADMIN' atau 'SUPER_ADMIN')
    if (kodeCabang === 'ALL' || role === 'ADMIN') {
      branchQuery = `SELECT kode_cabang, nama_cabang FROM dbw_bsp_konsolidasi.dw_ms_cabang  ORDER BY nama_cabang ASC`;
    } else {
      branchQuery = `SELECT kode_cabang, nama_cabang FROM dbw_bsp_konsolidasi.dw_ms_cabang WHERE kode_cabang = '${kodeCabang}' LIMIT 1`;
    }

    const [branchesRaw, principalRaw] = await Promise.all([
      clickhouse.query({ query: branchQuery, format: 'JSONEachRow' }).then(res => res.json()) as Promise<any[]>,
      clickhouse.query({ 
        query: `SELECT DISTINCT Kode_Principal as kode_principal, Nama_Principal as nama_principal 
                FROM dbw_bsp_konsolidasi.dw_ms_principal ORDER BY nama_principal ASC`, 
        format: 'JSONEachRow' 
      }).then(res => res.json()) as Promise<any[]>
    ]);

    // 3. Generate List Tahun
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = currentYear; y >= 2006; y--) { // Saya batasi sampai 2024 biar gak kepanjangan
      years.push(y.toString());
    }

    // 4. Return Data (SESUAIKAN KEY-NYA DENGAN FILTERBAR)
    // Di FilterBar.tsx kamu panggil data.cabang, data.divisi, data.tahun
    return NextResponse.json({
      cabang: branchesRaw, // FilterBar nunggu 'cabang'
      divisi: principalRaw, // FilterBar nunggu 'divisi'
      tahun: years,         // FilterBar nunggu 'tahun'
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