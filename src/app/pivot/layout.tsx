import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import DashboardContainer from '@/components/layout/DashboardContainer';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Script from 'next/script';

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
    <>
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdn.webdatarocks.com/latest/webdatarocks.min.css"
      />
      <Script
        src="https://cdn.webdatarocks.com/latest/webdatarocks.toolbar.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://cdn.webdatarocks.com/latest/webdatarocks.js"
        strategy="beforeInteractive"
      />
      <DashboardContainer user={user}>
        {children}
      </DashboardContainer>
    </>
  );
}