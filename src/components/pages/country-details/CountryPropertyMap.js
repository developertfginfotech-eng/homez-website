"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getAllProperties } from "@/helpers/propertyApi";

const DynamicMap = dynamic(
  () => import("@/components/listing/map-style/ListingMap1"),
  {
    ssr: false,
    loading: () => (
      <div className="text-center p-5">
        <div className="spinner-border text-thm" role="status">
          <span className="visually-hidden">Loading map...</span>
        </div>
      </div>
    ),
  }
);

const CountryPropertyMap = ({ country }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper function to match country name variations
  const matchesCountry = (propertyCountry, targetCountry) => {
    const countryVariations = {
      'United States': ['USA', 'US', 'United States', 'United States of America'],
      'United Arab Emirates': ['UAE', 'United Arab Emirates'],
      'United Kingdom': ['UK', 'United Kingdom', 'Great Britain'],
    };

    const targetLower = targetCountry.toLowerCase();
    const propertyLower = propertyCountry.toLowerCase();

    // Check if they match directly
    if (propertyLower === targetLower) return true;

    // Check variations
    for (const [key, variations] of Object.entries(countryVariations)) {
      if (key.toLowerCase() === targetLower) {
        return variations.some(v => v.toLowerCase() === propertyLower);
      }
      if (variations.some(v => v.toLowerCase() === targetLower)) {
        return variations.some(v => v.toLowerCase() === propertyLower) || key.toLowerCase() === propertyLower;
      }
    }

    return false;
  };

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getAllProperties();
        const filteredProperties = data.filter(
          (property) => matchesCountry(property.country, country)
        );
        setProperties(filteredProperties);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [country]);

  if (loading) {
    return (
      <div className="text-center p-5 bgc-white bdrs12">
        <div className="spinner-border text-thm" role="status">
          <span className="visually-hidden">Loading properties...</span>
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center p-5 bgc-white bdrs12">
        <p className="text">No properties available in {country} at the moment.</p>
      </div>
    );
  }

  return (
    <div className="bgc-white bdrs12 overflow-hidden position-relative">
      <div style={{ height: "500px", width: "100%" }}>
        <DynamicMap properties={properties} />
      </div>
      <div className="p-3 border-top">
        <p className="text mb-0 fz14">
          <span className="fw600">{properties.length}</span> properties available in {country}
        </p>
      </div>
    </div>
  );
};

export default CountryPropertyMap;
