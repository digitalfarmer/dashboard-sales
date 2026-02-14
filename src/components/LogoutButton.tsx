'use client';
import { deleteCookie } from 'cookies-next'; // atau pakai Server Action untuk hapus cookie
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();
  
  const handleLogout = () => {
    // Hapus cookie (ini cara simpel, baiknya pakai Server Action)
    document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push('/login');
  };

  return (
    <button onClick={handleLogout} className="text-red-500 hover:underline">
      Keluar Sistem
    </button>
  );
}