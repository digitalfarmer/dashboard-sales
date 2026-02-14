// src/app/dashboard/layout.tsx
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import { cookies } from 'next/headers';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  
  // Ambil data user dari session, kalau gak ada kasih object kosong biar gak error
  const user = session ? JSON.parse(session.value) : { fullName: 'User', role: 'GUEST', kodeCabang: '' };

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* OPER DATA USER KE NAVBAR */}
        <Navbar user={user} /> 
        
        <main className="p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}