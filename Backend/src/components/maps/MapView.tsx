'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Dynamic import for Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

const Polyline = dynamic(
  () => import('react-leaflet').then((mod) => mod.Polyline),
  { ssr: false }
);

interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description?: string;
}

interface MapViewProps {
  locations?: Location[];
  center?: [number, number];
  zoom?: number;
  className?: string;
  showPath?: boolean;
}

export default function MapView({ 
  locations = [], 
  center = [20, 0], 
  zoom = 2, 
  className = "h-[400px] w-full rounded-xl",
  showPath = false
}: MapViewProps) {

  // Fix for Leaflet default icon not loading in Next.js
  useEffect(() => {
    (async () => {
      const L = (await import('leaflet')).default;
      
      // @ts-ignore
      delete L.Icon.Default.prototype._getIconUrl;
      
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
    })();
  }, []);

  const pathCoordinates = locations.map(loc => [loc.lat, loc.lng] as [number, number]);

  return (
    <div className={className}>
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%", borderRadius: "inherit" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((loc) => (
          <Marker key={loc.id} position={[loc.lat, loc.lng]}>
            <Popup>
              <div className="text-center">
                <h3 className="font-bold text-slate-900">{loc.name}</h3>
                {loc.description && <p className="text-sm text-slate-600">{loc.description}</p>}
              </div>
            </Popup>
          </Marker>
        ))}
        {showPath && locations.length > 1 && (
          <Polyline positions={pathCoordinates} color="#0ea5e9" dashArray="10, 10" />
        )}
      </MapContainer>
    </div>
  );
}

