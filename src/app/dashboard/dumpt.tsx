"use client";
import React from 'react';
import Select from 'react-select';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTransition } from 'react';

// Contoh data options (nanti bisa kamu sesuaikan dari data API)
const branchOptions = [
  { value: 'ALL', label: 'SEMUA CABANG' },
  { value: 'C001', label: 'JAKARTA - PUSAT' },
  { value: 'C002', label: 'BANDUNG - JAWA BARAT' },
  // ... data lainnya
];

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleFilterChange = (key: string, selectedOption: any) => {
    const params = new URLSearchParams(searchParams.toString());
    const value = selectedOption?.value || 'ALL';

    if (value && value !== 'ALL') {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  // Styling Kustom biar cocok dengan tema Indigo & Rounded
  const customStyles = {
    control: (base: any) => ({
      ...base,
      borderRadius: '12px',
      padding: '2px',
      borderColor: '#e2e8f0', // slate-200
      '&:hover': { borderColor: '#4f46e5' }, // indigo-600
      boxShadow: 'none',
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected ? '#4f46e5' : state.isFocused ? '#f5f3ff' : 'white',
      color: state.isSelected ? 'white' : '#1e293b',
      fontSize: '14px',
      fontWeight: '500',
    }),
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm ${isPending ? 'opacity-50' : ''}`}>
      
      {/* Searchable Branch Select */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Branch</label>
        <Select
          instanceId="branch-select"
          options={branchOptions}
          styles={customStyles}
          placeholder="Cari Cabang..."
          onChange={(opt) => handleFilterChange('branch', opt)}
          defaultValue={branchOptions[0]}
          isSearchable={true}
        />
      </div>

      {/* Tambahkan Select lainnya untuk Year & Category dengan cara yang sama */}
      
    </div>
  );
}