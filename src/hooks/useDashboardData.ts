import { useState, useEffect } from 'react';

export function useDashboardData(selectedTahun: string, selectedCabang: string, selectedDivisi: string) {
    const [data, setData] = useState<any[]>([]);
    const [topProducts, setTopProducts] = useState<any[]>([]);
    const [mapData, setMapData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<string>("");

    useEffect(() => {
        const fetchAllData = async (showLoading = true) => {
            if (showLoading) setIsLoading(true);
            // setError(null); // Opsional: jangan reset error pas auto-refresh biar gak kedap-kedip

            try {
                const queryParams = `cabang=${selectedCabang}&divisi=${selectedDivisi}&tahun=${selectedTahun}`;

                const [salesRes, topRes, mapRes] = await Promise.all([
                    fetch(`/api/sales-monthly?${queryParams}`),
                    fetch(`/api/top-products?${queryParams}`),
                    fetch(`/api/map-data?${queryParams}`)
                ]);

                if (!salesRes.ok || !topRes.ok || !mapRes.ok) {
                    throw new Error('Gagal mengambil data dari server');
                }

                const [sData, tData, mData] = await Promise.all([
                    salesRes.json(),
                    topRes.json(),
                    mapRes.json()
                ]);

                // Jika sukses, set waktu sekarang
                const now = new Date();
                setLastUpdated(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

                setData(sData);
                setTopProducts(tData);
                setMapData(mData);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        // 1. Jalankan fetch pertama kali
        fetchAllData(true);

        // 2. Set interval untuk refresh (misal: tiap 5 menit / 300.000 ms)
        const interval = setInterval(() => {
            console.log("Auto-refreshing data...");
            fetchAllData(false); // Kirim 'false' agar tidak muncul skeleton loading tiap refresh
        }, 300000);

        // 3. Bersihkan interval saat komponen di-unmount atau filter berubah
        return () => clearInterval(interval);

    }, [selectedTahun, selectedCabang, selectedDivisi]);

    // Kalkulasi Summary
    const totalGross = data.reduce((acc, curr: any) => acc + Number(curr.total_gross), 0);
    const totalRetur = data.reduce((acc, curr: any) => acc + Number(curr.total_retur), 0);
    const totalNetto = data.reduce((acc, curr: any) => acc + Number(curr.total_netto_bersih), 0);
    const returnRate = totalGross !== 0 ? (totalRetur / totalGross) * 100 : 0;
    //const trends = trends;

    const calculateTrend = (dataArray: any[], key: string) => {
        if (dataArray.length < 2) return 0;

        // Ambil 2 bulan terakhir dari data (asumsi data urut berdasarkan bulan)
        const currentMonth = Number(dataArray[dataArray.length - 1][key]) || 0;
        const prevMonth = Number(dataArray[dataArray.length - 2][key]) || 0;

        if (prevMonth === 0) return 0;

        // Rumus: ((Sekarang - Lalu) / Lalu) * 100
        return parseFloat((((currentMonth - prevMonth) / prevMonth) * 100).toFixed(1));
    };

    const trends = {
        gross: calculateTrend(data, 'total_gross'),
        netto: calculateTrend(data, 'total_netto_bersih'),
        retur: calculateTrend(data, 'total_retur'),
        // Khusus return rate, kita bandingkan rate bulan ini vs rate bulan lalu
        returnRate: (() => {
            if (data.length < 2) return 0;
            const currentRate = (Number(data[data.length - 1].total_retur) / Number(data[data.length - 1].total_gross)) * 100;
            const prevRate = (Number(data[data.length - 2].total_retur) / Number(data[data.length - 2].total_gross)) * 100;
            return parseFloat((currentRate - prevRate).toFixed(2)); // Hasilnya selisih poin (misal: naik 0.5%)
        })()
    };

    return {
        data,
        topProducts,
        mapData,
        isLoading,
        error,
        lastUpdated,
        summary: { totalGross, totalRetur, totalNetto, returnRate },
        trends
    };
}