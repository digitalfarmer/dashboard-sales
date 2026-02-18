// <<<<<<< HEAD
export const dynamic = 'force-dynamic'; // Tambahkan ini
// =======
// 1. Paksa halaman menjadi dinamis
// export const dynamic = 'force-dynamic';

// >>>>>>> 359c404dfe5b6f69ab4e53745969a72327d1a309
import { prisma } from "@/lib/prisma";

export default async function TestDBPage() {
  // 2. Proteksi Build: Cek apakah DATABASE_URL menggunakan nilai dummy
  // Jika sedang build di GitLab/Docker, kita lewati query database
  if (process.env.DATABASE_URL?.includes('dummy') || process.env.NODE_ENV === 'production' && !process.env.KUBERNETES_SERVICE_HOST) {
     return (
       <div className="p-10">
         <h1 className="text-2xl font-bold mb-4">Build Mode</h1>
         <p>Database query ditangguhkan hingga aplikasi berjalan di K3s.</p>
       </div>
     );
  }

  try {
    // 3. Eksekusi Query (Hanya akan jalan di Cluster K3s)
    const allUsers = await prisma.user.findMany();

    return (
      <div className="p-10">
        <h1 className="text-2xl font-bold mb-4 text-green-600">
          Koneksi Berhasil!
        </h1>
        <p className="mb-4">Daftar User di Postgres:</p>
        <pre className="bg-slate-100 p-4 rounded border overflow-auto max-h-96">
          {JSON.stringify(allUsers, null, 2)}
        </pre>
      </div>
    );
  } catch (error: any) {
    return (
      <div className="p-10">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Koneksi Gagal</h1>
        <div className="bg-red-50 p-4 rounded border border-red-200">
          <p className="font-mono text-sm">{error.message}</p>
        </div>
      </div>
    );
  }
}