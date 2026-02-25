import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import DashboardContainer from '@/components/layout/DashboardContainer';
import { getServerSession } from 'next-auth';

import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/login');
  }
  
  const user = session.user as any;

  return (
    <DashboardContainer user={user}>
      {children}
    </DashboardContainer>
  );
}