export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      {/* Kamu bisa pakai Spinner atau Skeleton di sini */}
      {/* <div className="relative">
        <div className="size-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div> */}
      <div className="flex flex-col items-center justify-center py-20">
      {/* Container Spinner */}
      <div className="relative size-16 mb-6">
        {/* Ring Dasar (Mati) */}
        <div className="absolute inset-0 border-4 border-slate-100 dark:border-slate-800 rounded-full"></div>
        
        {/* Ring Aktif (Berputar) - Menggunakan Warna Brand Indigo */}
        <div className="absolute inset-0 border-4 border-transparent border-t-indigo-600 border-l-indigo-600 rounded-full animate-spin"></div>
      </div>

      {/* Teks Loading yang Selaras */}
      <div className="text-center space-y-1">
        <p className="text-lg font-black text-slate-800 dark:text-white tracking-tight italic uppercase">
          Processing <span className="text-indigo-600">Data</span>
        </p>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] animate-pulse">
          Connecting to ClickHouse
        </p>
      </div>
    </div>
      <p className="text-slate-500 font-medium animate-pulse">Data prepare, please Wait...</p>
    </div>
  );
}