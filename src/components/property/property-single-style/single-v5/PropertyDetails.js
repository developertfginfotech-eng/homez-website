"use client";
import React, { useState, useEffect } from "react";
import { propertiesAPI } from "@/services/api";

const PropertyDetails = ({id}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await propertiesAPI.getById(id);
        if (response.property) {
          setData(response.property);
        }
      } catch (error) {
        console.error("Failed to fetch property:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>Property details not found</div>;
  }

  const columns = [
    [
      {
        label: "Property ID",
        value: data._id?.slice(-8) || "N/A",
      },
      {
        label: "Price",
        value: `$${data.price}`,
      },
      {
        label: "Property Size",
        value: `${data.sizeInFt || 0} Sq Ft`,
      },
      {
        label: "Bathrooms",
        value: data.bathrooms || 0,
      },
      {
        label: "Bedrooms",
        value: data.bedrooms || 0,
      },
    ],
    [
      {
        label: "Garage",
        value: data.parking || "N/A",
      },
      {
        label: "Garage Size",
        value: "N/A",
      },
      {
        label: "Year Built",
        value: data.yearBuilt || "N/A",
      },
      {
        label: "Property Type",
        value: data.propertyType || "N/A",
      },
      {
        label: "Property Status",
        value: `For ${data.propertyAdType === 'rent' ? 'rent' : 'sale'}`,
      },
    ],
  ];

  return (
    <div className="row">
      {columns.map((column, columnIndex) => (
        <div key={columnIndex} className="col-md-6 col-xl-6">
          {column.map((detail, index) => (
            <div key={index} className="d-flex justify-content-between">
              <div className="pd-list">
                <p className="fw600 mb10 ff-heading dark-color">
                  {detail.label}
                </p>
              </div>
              <div className="pd-list">
                <p className="text mb10">{detail.value}</p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default PropertyDetails;
