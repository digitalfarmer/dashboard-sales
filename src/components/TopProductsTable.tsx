'use client';

import { Package } from 'lucide-react';

interface Product {
  nama_barang: string;
  total_qty: number;
  total_gross: number;
}

interface TopProductsTableProps {
  products: Product[];
}

export default function TopProductsTable({ products }: TopProductsTableProps) {
  return (
    <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
          <Package size={20} />
        </div>
        <h3 className="font-bold text-gray-800">Top 10 Produk Terlaris</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b">
              <th className="pb-3">Nama Produk</th>
              <th className="pb-3 text-right">Qty</th>
              <th className="pb-3 text-right">Total Netto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.length > 0 ? (
              products.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 text-sm text-gray-700 font-medium max-w-[200px] truncate">
                    {item.nama_barang}
                  </td>
                  <td className="py-3 text-sm text-gray-600 text-right">
                    {Number(item.total_qty).toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 text-sm font-bold text-blue-600 text-right">
                    Rp {Number(item.total_gross).toLocaleString('id-ID')}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-10 text-center text-gray-400 text-sm italic">
                  Tidak ada data produk
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}