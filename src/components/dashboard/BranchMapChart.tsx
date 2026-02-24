"use client";
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';

// userBranch: ambil dari session (misal: 'ALL' atau 'C01')
export default function BranchMapChart({ data, userBranch }: { data: any[], userBranch: string }) {
    const center: [number, number] = [-2.5489, 118.0149];

    // 1. Cari nilai MAX Netto untuk klasifikasi dinamis
    const maxNetto = data && data.length > 0 ? Math.max(...data.map(d => d.total_netto)) : 0;

    // 2. Fungsi Helper Warna & Ukuran
    const getStyleByPerformance = (netto: number) => {
        if (netto >= maxNetto * 0.7) {
            return { color: "#2563eb", label: "Tinggi", radius: 14 }; // Biru
        } else if (netto >= maxNetto * 0.3) {
            return { color: "#16a34a", label: "Sedang", radius: 10 }; // Hijau
        } else {
            return { color: "#ea580c", label: "Rendah", radius: 7 };  // Orange
        }
    };

    return (
        <div style={{ height: '600px', width: '100%' }} className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden relative">
            <div className="mb-4 flex justify-between items-center px-2">
                <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Sebaran Performa Cabang</h3>
                    <p className="text-xs text-slate-500 uppercase font-semibold italic">
                        {userBranch === 'ALL' ? 'Mode: Kantor Pusat (All Access)' : `Mode: Terbatas (${userBranch})`}
                    </p>
                </div>

                {/* Legend */}
                <div className="flex gap-4 bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
                        <span className="w-3 h-3 rounded-full bg-[#2563eb]"></span> TINGGI
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
                        <span className="w-3 h-3 rounded-full bg-[#16a34a]"></span> SEDANG
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
                        <span className="w-3 h-3 rounded-full bg-[#ea580c]"></span> RENDAH
                    </div>
                </div>
            </div>

            <div style={{ height: '480px', width: '100%', borderRadius: '1.5rem', overflow: 'hidden' }} className="border border-slate-200 shadow-inner">
                <MapContainer center={center} zoom={5} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; OpenStreetMap contributors'
                    />

                    {data?.map((branch, idx) => {
                        // LOGIKA SECURITY: Cek akses user
                        const hasAccess = userBranch === 'ALL' || userBranch === branch.kode_cabang;
                        const style = getStyleByPerformance(branch.total_netto);

                        return branch.latitude && (
                            <CircleMarker
                                key={idx}
                                center={[branch.latitude, branch.longitude]}
                                // Jika disable: radius diperkecil, warna jadi abu-abu
                                radius={hasAccess ? style.radius : 5}
                                fillColor={hasAccess ? style.color : "#cbd5e1"} 
                                color={hasAccess ? "#ffffff" : "#f1f5f9"}
                                weight={hasAccess ? 2 : 1}
                                fillOpacity={hasAccess ? 0.8 : 0.2}
                                className={hasAccess ? "cursor-pointer" : "cursor-not-allowed"}
                            >
                                {/* Popup hanya muncul jika user punya akses */}
                                {hasAccess && (
                                    <Popup>
                                        <div className="min-w-[200px] overflow-hidden rounded-lg font-sans">
                                            {/* HEADER: Background Warna Tier */}
                                            <div
                                                className="p-3 text-white flex justify-between items-center"
                                                style={{ backgroundColor: style.color }}
                                            >
                                                <div>
                                                    <p className="text-[10px] font-bold opacity-80 uppercase tracking-tighter">
                                                        Tier {style.label}
                                                    </p>
                                                    <h4 className="font-black text-sm uppercase leading-tight">
                                                        {branch.nama_cabang}
                                                    </h4>
                                                </div>
                                                <span className="text-[10px] font-mono bg-white/20 px-1.5 py-0.5 rounded">
                                                    {branch.kode_cabang}
                                                </span>
                                            </div>

                                            {/* BODY */}
                                            <div className="p-3 bg-white dark:bg-slate-900 space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase">Gross Sales</span>
                                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                                                        Rp {branch.total_gross.toLocaleString('id-ID')}
                                                    </span>
                                                </div>

                                                <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800">
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase italic">Netto Sales</span>
                                                    <span className="text-sm font-black text-slate-900 dark:text-white">
                                                        Rp {branch.total_netto.toLocaleString('id-ID')}
                                                    </span>
                                                </div>

                                                <div className="mt-2 text-[8px] text-slate-400 flex justify-between pt-1 opacity-60">
                                                    <span>LAT: {branch.latitude.toFixed(4)}</span>
                                                    <span>LON: {branch.longitude.toFixed(4)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Popup>
                                )}
                            </CircleMarker>
                        );
                    })}
                </MapContainer>
            </div>
        </div>
    );
}