import { cookies } from 'next/headers';
import DashboardContainer from '@/components/layout/DashboardContainer';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  
  // Data user diambil sekali di sini
  const user = session ? JSON.parse(session.value) : { fullName: 'User', role: 'GUEST', kodeCabang: '' };

  return (
    <DashboardContainer user={user}>
      {children}
    </DashboardContainer>
  );
}