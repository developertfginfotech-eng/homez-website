"use client";
import React, { useEffect, useState } from "react";

const Map = () => {
  const [mapUrl, setMapUrl] = useState(
    "https://maps.google.com/maps?q=London%20Eye%2C%20London%2C%20United%20Kingdom&t=m&z=14&output=embed&iwloc=near"
  );
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [countryState, setCountryState] = useState("");
  const [country, setCountry] = useState("");

  useEffect(() => {
    // Update map when inputs change
    const handleFormChange = () => {
      const addressInput =
        document.querySelector('input[name="address"]')?.value || "";
      const citySelect = document.querySelector('input[name="city"]')?.value || "";
      const stateSelect =
        document.querySelector('input[name="countryState"]')?.value || "";
      const countrySelect =
        document.querySelector('input[name="country"]')?.value || "";

      setAddress(addressInput);
      setCity(citySelect);
      setCountryState(stateSelect);
      setCountry(countrySelect);

      // Build location string for map
      let locationString = [];
      if (addressInput) locationString.push(addressInput);
      if (citySelect) locationString.push(citySelect);
      if (stateSelect) locationString.push(stateSelect);
      if (countrySelect) locationString.push(countrySelect);

      const fullLocation = locationString.join(", ") || "London Eye, London, United Kingdom";

      // Create map URL
      const encodedLocation = encodeURIComponent(fullLocation);
      const newMapUrl = `https://maps.google.com/maps?q=${encodedLocation}&t=m&z=14&output=embed&iwloc=near`;

      setMapUrl(newMapUrl);
    };

    // Listen for input changes
    const addressInput = document.querySelector('input[name="address"]');
    const latitudeInput = document.querySelector('input[name="latitude"]');
    const longitudeInput = document.querySelector('input[name="longitude"]');

    if (addressInput) {
      addressInput.addEventListener("change", handleFormChange);
      addressInput.addEventListener("blur", handleFormChange);
    }

    // Check for location input changes periodically
    const interval = setInterval(handleFormChange, 1000);

    return () => {
      if (addressInput) {
        addressInput.removeEventListener("change", handleFormChange);
        addressInput.removeEventListener("blur", handleFormChange);
      }
      clearInterval(interval);
    };
  }, []);

  const handleMapDragEnd = () => {
    // Note: Getting coordinates from embedded map is difficult
    // Users can manually enter latitude/longitude
    console.log(
      "Map interaction detected. Please enter latitude and longitude manually or use the coordinates from the map."
    );
  };

  return (
    <div className="map-container">
      <iframe
        className="h550"
        loading="lazy"
        src={mapUrl}
        title="Property Location Map"
        aria-label="Property Location Map"
        style={{ width: "100%", height: "550px", border: "none" }}
      />
      <div className="mt10 p10 bg-light">
        <small className="text-muted">
          💡 Tip: Fill in the address field to see the location on the map. You can also manually enter latitude and longitude coordinates below.
        </small>
      </div>
    </div>
  );
};

export default Map;
