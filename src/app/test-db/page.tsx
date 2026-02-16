export const dynamic = 'force-dynamic'; // Tambahkan ini
import { prisma } from "@/lib/prisma";

export default async function TestDBPage() {
  // Ambil semua user dari PostgreSQL
  const allUsers = await prisma.user.findMany();

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Daftar User di Postgres:</h1>
      <pre className="bg-slate-100 p-4 rounded border">
        {JSON.stringify(allUsers, null, 2)}
      </pre>
    </div>
  );
}