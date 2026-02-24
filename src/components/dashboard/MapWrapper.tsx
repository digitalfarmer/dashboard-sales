"use client"; // Wajib ada ini

import dynamic from 'next/dynamic';

// Kita pindahkan dynamic import ke sini
const BranchMapChart = dynamic(
  () => import('./BranchMapChart'),
  { 
    ssr: false, 
    loading: () => (
      <div className="h-[600px] w-full bg-slate-100 animate-pulse rounded-[2.5rem] flex items-center justify-center">
        <p className="text-slate-400 font-bold tracking-widest animate-bounce">MEMUAT PETA INDONESIA...</p>
      </div>
    )
  }
);

export default function MapWrapper({ data, userBranch }: { data: any[], userBranch: string }) {
  return <BranchMapChart data={data} userBranch={userBranch} />;
}