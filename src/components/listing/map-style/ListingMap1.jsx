"use client";
import { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

// Dynamically import Leaflet components (client-side only)
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

export default function ListingMap1({ properties = [] }) {
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [mapError, setMapError] = useState(null);

  useEffect(() => {
    try {
      setIsMounted(true);
      setLeafletLoaded(true);
    } catch (error) {
      console.error('Map initialization error:', error);
      setMapError(error.message);
    }
  }, []);

  // Country-specific default coordinates
  const getCountryCoordinates = (countryName) => {
    const coordinates = {
      'Australia': [-33.8688, 151.2093], // Sydney
      'UAE': [25.2048, 55.2708], // Dubai
      'United Arab Emirates': [25.2048, 55.2708], // Dubai
      'USA': [40.7128, -74.0060], // New York
      'United States': [40.7128, -74.0060], // New York
      'UK': [51.5074, -0.1278], // London
      'United Kingdom': [51.5074, -0.1278], // London
      'Canada': [43.6532, -79.3832], // Toronto
      'India': [28.6139, 77.2090], // New Delhi
      'Germany': [52.5200, 13.4050], // Berlin
      'France': [48.8566, 2.3522], // Paris
    };
    return coordinates[countryName] || [25.2048, 55.2708]; // Default to Dubai if country not found
  };

  // Calculate center based on properties or use country-specific default
  const center = useMemo(() => {
    if (properties.length > 0) {
      // Try to use first property with valid coordinates
      if (properties[0].latitude && properties[0].longitude) {
        return [properties[0].latitude, properties[0].longitude];
      }
      // Otherwise use country-specific default
      if (properties[0].country) {
        return getCountryCoordinates(properties[0].country);
      }
    }
    // Fallback to Dubai
    return [25.2048, 55.2708];
  }, [properties]);

  if (mapError) {
    return (
      <div style={{ height: "100%", minHeight: "400px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <p>Unable to load map</p>
        <small style={{ color: "#999" }}>{mapError}</small>
      </div>
    );
  }

  if (!isMounted || !leafletLoaded) {
    return <div style={{ height: "100%", minHeight: "400px", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading map...</div>;
  }

  // Check if we're using property coordinates or country default
  const hasPropertyCoordinates = properties.length > 0 && properties[0].latitude && properties[0].longitude;
  const propertiesWithCoordinates = properties.filter(p => p.latitude && p.longitude);

  return (
    <>
      {!hasPropertyCoordinates && properties.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(235, 103, 83, 0.95)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '6px',
          fontSize: '12px',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          fontWeight: '500'
        }}>
          <i className="fas fa-info-circle me-2"></i>
          Showing {properties[0].country || 'country'} overview - Add property coordinates for exact locations
        </div>
      )}
      <MapContainer
        key={`map-${properties.length}-${center[0]}-${center[1]}`}
        center={center}
        zoom={hasPropertyCoordinates ? (properties.length > 1 ? 10 : 13) : 11}
        style={{ height: "100%", width: "100%", minHeight: "400px" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {properties
          .filter(marker => marker.latitude && marker.longitude)
          .map((marker) => (
            <Marker
              key={marker.id}
              position={[marker.latitude, marker.longitude]}
            >
              <Popup>
                <div style={{ width: "250px" }}>
                  <div className="listing-style1">
                    <div className="list-thumb">
                      <Image
                        width={250}
                        height={150}
                        className="w-100 h-auto cover"
                        src={marker.image || "/images/listings/listing-1.jpg"}
                        alt={marker.title}
                        style={{ borderRadius: "8px 8px 0 0" }}
                      />
                      {!marker.forRent && (
                        <div className="sale-sticker-wrap">
                          <div className="list-tag fz12">
                            <span className="flaticon-electricity me-2" />
                            FEATURED
                          </div>
                        </div>
                      )}
                      <div className="list-price" style={{ position: "absolute", bottom: "10px", left: "10px", background: "rgba(0,0,0,0.7)", padding: "5px 10px", borderRadius: "4px", color: "white" }}>
                        {marker.price} / <span>mo</span>
                      </div>
                    </div>
                    <div className="list-content" style={{ padding: "10px" }}>
                      <h6 className="list-title" style={{ fontSize: "14px", marginBottom: "5px" }}>
                        <Link href={`/single-v5/${marker.id}`}>
                          {marker.title}
                        </Link>
                      </h6>
                      <p className="list-text" style={{ fontSize: "12px", marginBottom: "8px" }}>{marker.location}</p>
                      <div className="list-meta d-flex align-items-center" style={{ fontSize: "11px", gap: "8px" }}>
                        <span>
                          <span className="flaticon-bed" /> {marker.bed} bed
                        </span>
                        <span>
                          <span className="flaticon-shower" /> {marker.bath} bath
                        </span>
                        <span>
                          <span className="flaticon-expand" /> {marker.sqft} sqft
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))
        }
      </MapContainer>
    </>
  );
}
