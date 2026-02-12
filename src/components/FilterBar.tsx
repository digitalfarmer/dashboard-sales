'use client';

import React from 'react';
import { Calendar, MapPin, Layers, Info } from 'lucide-react';

interface FilterBarProps {
  selectedTahun: string;
  setSelectedTahun: (v: string) => void;
  selectedCabang: string;
  setSelectedCabang: (v: string) => void;
  selectedDivisi: string;
  setSelectedDivisi: (v: string) => void;
  listTahun: string[];
  listCabang: any[];
  listDivisi: any[];
  isLoading?: boolean;
}

export default function FilterBar({
  selectedTahun, setSelectedTahun,
  selectedCabang, setSelectedCabang,
  selectedDivisi, setSelectedDivisi,
  listTahun, listCabang, listDivisi,
  isLoading = false // Default false
}: FilterBarProps) {

  return (
    <div className="bg-white/80 backdrop-blur-md sticky top-0 z-30 mb-8 p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap items-end gap-6 transition-all">
      
      {/* Filter Tahun */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-1">
          <Calendar size={14} className="text-blue-500" />
          Tahun
        </label>
        <select 
          value={selectedTahun}
          onChange={(e) => setSelectedTahun(e.target.value)}
          className="appearance-none border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50/50 text-sm font-semibold text-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all cursor-pointer min-w-[100px]"
        >
          {listTahun?.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Filter Cabang */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-1">
          <MapPin size={14} className="text-emerald-500" />
          Cabang
        </label>
        <select 
          value={selectedCabang}
          onChange={(e) => setSelectedCabang(e.target.value)}
          className="appearance-none border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50/50 text-sm font-semibold text-slate-700 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all cursor-pointer min-w-[180px]"
        >
          <option value="all">Semua Cabang</option>
          {listCabang?.map((c) => (
            <option key={c.kode_cabang} value={c.kode_cabang}>{c.nama_cabang}</option>
          ))}
        </select>
      </div>

      {/* Filter Divisi */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-1">
          <Layers size={14} className="text-orange-500" />
          Divisi Produk
        </label>
        <select 
          value={selectedDivisi}
          onChange={(e) => setSelectedDivisi(e.target.value)}
          className="appearance-none border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50/50 text-sm font-semibold text-slate-700 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all cursor-pointer min-w-[180px]"
        >
          <option value="all">Semua Divisi</option>
          {listDivisi?.map((d) => (
            <option key={d.kode_divisi_produk} value={d.kode_divisi_produk}>{d.kode_divisi_produk}</option>
          ))}
        </select>
      </div>

      {/* Info Engine */}
      <div className="flex-grow flex justify-end items-center pb-2">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-slate-500">
          <Info size={14} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Engine: ClickHouse</span>
        </div>
      </div>




    </div>
  );
}