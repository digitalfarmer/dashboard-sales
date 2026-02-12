'use client';
//filter buat semua component di dashboard utama
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
}

export default function FilterBar({
  selectedTahun, setSelectedTahun,
  selectedCabang, setSelectedCabang,
  selectedDivisi, setSelectedDivisi,
  listTahun, listCabang, listDivisi
}: FilterBarProps) {

  return (
    <div className="flex flex-wrap gap-4 bg-white p-4 rounded-xl shadow-sm mb-6 border border-gray-100 items-end">
      {/* Filter Tahun */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tahun</label>
        <select 
          value={selectedTahun}
          onChange={(e) => setSelectedTahun(e.target.value)}
          className="border rounded-lg px-3 py-2 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500  transition-all"
        >
          {listTahun?.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Filter Cabang */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Cabang</label>
        <select 
          value={selectedCabang}
          onChange={(e) => setSelectedCabang(e.target.value)}
          className="border rounded-lg px-3 py-2 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none min-w-[150px]"
        >
          <option value="all">Semua Cabang</option>
          {listCabang?.map((c) => (
            <option key={c.kode_cabang} value={c.kode_cabang}>{c.nama_cabang}</option>
          ))}
        </select>
      </div>

      {/* Filter Divisi */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Divisi Produk</label>
        <select 
          value={selectedDivisi}
          onChange={(e) => setSelectedDivisi(e.target.value)}
          className="border rounded-lg px-3 py-2 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none min-w-[150px]"
        >
          <option value="all">Semua Divisi</option>
          {listDivisi?.map((d) => (
            <option key={d.kode_divisi_produk} value={d.kode_divisi_produk}>{d.kode_divisi_produk}</option>
          ))}
        </select>
      </div>

      {/* Tombol Reset atau Info Tambahan bisa di sini */}
     <div className="mt-2 ml-1 text-[10px] text-gray-400 italic">
        * Data ClickHouse
      </div>
    </div>
  );
}