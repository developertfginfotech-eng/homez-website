"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { propertiesAPI } from "@/services/api";

const PropertyAddress = ({ property: propProperty }) => {
  const [property, setProperty] = useState(propProperty || null);
  const [loading, setLoading] = useState(!propProperty);
  const params = useParams();

  useEffect(() => {
    if (propProperty) {
      setProperty(propProperty);
      return;
    }

    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await propertiesAPI.getById(params.id);
        if (response.property) {
          setProperty(response.property);
        }
      } catch (error) {
        console.error("Failed to fetch property:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProperty();
    }
  }, [params.id, propProperty]);

  if (loading) return null;
  if (!property) return null;

  const address = {
    address: property.address || "N/A",
    city: property.city || "N/A",
    state: property.countryState || "N/A",
    zipCode: property.zipCode || "N/A",
    area: property.neighborhood || "N/A",
    country: property.country || "N/A",
  };

  return (
    <>
      <div className="col-md-6 col-xl-4">
        <div className="d-flex justify-content-between">
          <div className="pd-list">
            <p className="fw600 mb10 ff-heading dark-color">Address</p>
            <p className="fw600 mb10 ff-heading dark-color">City</p>
            <p className="fw600 mb-0 ff-heading dark-color">State/county</p>
          </div>
          <div className="pd-list">
            <p className="text mb10">{address.address}</p>
            <p className="text mb10">{address.city}</p>
            <p className="text mb-0">{address.state}</p>
          </div>
        </div>
      </div>

      <div className="col-md-6 col-xl-4 offset-xl-2">
        <div className="d-flex justify-content-between">
          <div className="pd-list">
            <p className="fw600 mb10 ff-heading dark-color">Zip/Postal Code</p>
            <p className="fw600 mb10 ff-heading dark-color">Area</p>
            <p className="fw600 mb-0 ff-heading dark-color">Country</p>
          </div>
          <div className="pd-list">
            <p className="text mb10">{address.zipCode}</p>
            <p className="text mb10">{address.area}</p>
            <p className="text mb-0">{address.country}</p>
          </div>
        </div>
      </div>
      {/* End col */}

      <div className="col-md-12">
        <iframe
          className="position-relative bdrs12 mt30 h250"
          loading="lazy"
          src={`https://maps.google.com/maps?q=${encodeURIComponent(address.address + ', ' + address.city)}&t=m&z=14&output=embed&iwloc=near`}
          title={address.address}
          aria-label={address.address}
        />
      </div>
      {/* End col */}
    </>
  );
};

export default PropertyAddress;
