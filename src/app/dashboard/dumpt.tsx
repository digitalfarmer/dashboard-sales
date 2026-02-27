// Di src/app/pivot/page.tsx, bagian fallback Suspense:

<Suspense 
  key={JSON.stringify(filterParams)} 
  fallback={
    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
      
      {/* --- INI SPINNER BARUNYA --- */}
      <div className="size-16 relative mb-6">
        {/* Layer 1: Background Circle (Slate) */}
        <div className="absolute inset-0 border-4 border-slate-100 dark:border-slate-800 rounded-full"></div>
        
        {/* Layer 2: Animated Gradient Ring */}
        <div className="absolute inset-0 border-t-4 border-l-4 border-transparent rounded-full animate-multi-spin"
             style={{
               borderTopColor: '#4f46e5', // Indigo-600
               borderLeftColor: '#f59e0b', // Amber-500 (Buat efek ganti warna saat muter)
               filter: 'drop-shadow(0 0 4px #4f46e5)' // Efek Glow/Neon kecil
             }}
        ></div>
      </div>
      {/* ----------------------------- */}

      <p className="font-bold text-slate-600 dark:text-slate-300 animate-pulse tracking-tight text-lg">
        Menyiapkan <span className="text-indigo-600">Pivot Sales</span>
      </p>
      <p className="text-sm text-slate-500 animate-pulse">Menghubungkan ke server ClickHouse...</p>
    </div>
  }
>
  <PivotDataLoader filters={filterParams} />
</Suspense>