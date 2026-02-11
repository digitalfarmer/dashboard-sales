'use client';
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fungsi untuk menggerakkan kamera peta secara otomatis
function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, {
      duration: 1.5 // Durasi pergerakan kamera (detik)
    });
  }, [center, zoom, map]);
  return null;
}

function ZoomHandler({ setZoom }: { setZoom: (z: number) => void }) {
  useMapEvents({
    zoomend: (e) => setZoom(e.target.getZoom()),
  });
  return null;
}

// Fungsi untuk menentukan warna marker
const getMarkerColor = (value: number) => {
  if (value >= 5000000000) return '#10b981'; // Hijau (> 5M)
  if (value >= 1000000000) return '#f59e0b'; // Kuning (1M - 5M)
  return '#ef4444'; // Merah (< 1M)
};

export default function DistributionMap({ data }: { data: any[] }) {
  const [zoom, setZoom] = useState(5);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-2.5489, 118.0149]);

  // Pantau perubahan data (saat filter cabang berubah)
  useEffect(() => {
    if (data && data.length === 1) {
      // Jika hanya ada 1 cabang (karena difilter), fokus ke koordinat cabang tersebut
      setMapCenter(data[0].coords);
      setZoom(8); // Zoom lebih dekat
    } else if (data && data.length > 1) {
      // Jika banyak cabang (nasional), kembali ke tampilan awal
      setMapCenter([-2.5489, 118.0149]);
      setZoom(5);
    }
  }, [data]);

  return (
    <div className="relative h-[500px] w-full rounded-xl overflow-hidden border z-0">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        {/* Tambahkan komponen penggerak kamera di sini */}
        <ChangeView center={mapCenter} zoom={zoom} />
        <ZoomHandler setZoom={setZoom} />

        {data.map((item, idx) => {
          const sales = item.total_sales;
          const markerColor = getMarkerColor(sales);
          
          return (
            <CircleMarker
              key={idx}
              center={item.coords}
              radius={Math.max(8, (sales / 2000000000) * (zoom / 5))}
              fillColor={markerColor}
              color="#fff"
              weight={1}
              fillOpacity={0.6}
            >
              <Popup>
                <div className="font-sans text-center">
                  <p className="font-bold border-b pb-1 mb-1">{item.nama_cabang}</p>
                  <p style={{ color: markerColor }} className="font-bold">
                    Rp {sales.toLocaleString('id-ID')}
                  </p>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
      
      {/* Legend Sederhana */}
      <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-md z-[1000] border text-[10px] font-bold">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full bg-[#10b981]"></div> <span> {'>'} 5M (High)</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full bg-[#f59e0b]"></div> <span> 1M - 5M (Medium)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ef4444]"></div> <span> {'<'} 1M (Low)</span>
        </div>
      </div>
    </div>
  );
}