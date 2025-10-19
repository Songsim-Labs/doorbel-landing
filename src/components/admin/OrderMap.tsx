'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface OrderMapProps {
  pickupLocation: {
    coordinates: [number, number]; // [longitude, latitude]
    address: string;
    ghanaPostGPS: string;
  };
  deliveryLocation: {
    coordinates: [number, number];
    address: string;
    ghanaPostGPS: string;
  };
  riderLocation?: {
    coordinates: [number, number];
  };
  className?: string;
}

export function OrderMap({
  pickupLocation,
  deliveryLocation,
  riderLocation,
  className = '',
}: OrderMapProps) {
  const [iconsLoaded, setIconsLoaded] = useState(false);

  useEffect(() => {
    // Fix for default markers in Leaflet
    const iconProto = L.Icon.Default.prototype as unknown as { _getIconUrl?: string };
    if (iconProto._getIconUrl) {
      delete iconProto._getIconUrl;
    }
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
    setIconsLoaded(true);
  }, []);

  if (!iconsLoaded) {
    return (
      <div className={`rounded-lg border flex items-center justify-center ${className}`}>
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  // Convert coordinates from [lng, lat] to [lat, lng] for Leaflet
  const pickupLatLng: [number, number] = [pickupLocation.coordinates[1], pickupLocation.coordinates[0]];
  const deliveryLatLng: [number, number] = [deliveryLocation.coordinates[1], deliveryLocation.coordinates[0]];
  const riderLatLng: [number, number] | undefined = riderLocation
    ? [riderLocation.coordinates[1], riderLocation.coordinates[0]]
    : undefined;

  // Calculate center point between pickup and delivery
  const centerLat = (pickupLatLng[0] + deliveryLatLng[0]) / 2;
  const centerLng = (pickupLatLng[1] + deliveryLatLng[1]) / 2;
  const center: [number, number] = [centerLat, centerLng];

  // Create custom icons
  const pickupIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const deliveryIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const riderIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <div className={`rounded-lg overflow-hidden border ${className}`}>
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%', minHeight: '400px' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Pickup Marker */}
        <Marker position={pickupLatLng} icon={pickupIcon}>
          <Popup>
            <div className="text-sm">
              <p className="font-semibold text-green-600">Pickup Location</p>
              <p className="mt-1">{pickupLocation.address}</p>
              <p className="text-xs text-muted-foreground mt-1">
                GPS: {pickupLocation.ghanaPostGPS}
              </p>
            </div>
          </Popup>
        </Marker>

        {/* Delivery Marker */}
        <Marker position={deliveryLatLng} icon={deliveryIcon}>
          <Popup>
            <div className="text-sm">
              <p className="font-semibold text-red-600">Delivery Location</p>
              <p className="mt-1">{deliveryLocation.address}</p>
              <p className="text-xs text-muted-foreground mt-1">
                GPS: {deliveryLocation.ghanaPostGPS}
              </p>
            </div>
          </Popup>
        </Marker>

        {/* Rider Marker (if available) */}
        {riderLatLng && (
          <Marker position={riderLatLng} icon={riderIcon}>
            <Popup>
              <div className="text-sm">
                <p className="font-semibold text-blue-600">Rider Location</p>
                <p className="text-xs text-muted-foreground mt-1">Live tracking</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Route Line */}
        <Polyline
          positions={[pickupLatLng, deliveryLatLng]}
          color="hsl(var(--primary))"
          weight={3}
          opacity={0.7}
          dashArray="10, 10"
        />
      </MapContainer>
    </div>
  );
}
