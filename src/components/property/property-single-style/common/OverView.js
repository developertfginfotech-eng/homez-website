"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { propertiesAPI } from "@/services/api";

const OverView = ({ property: propProperty }) => {
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

  const overviewData = [
    {
      icon: "flaticon-bed",
      label: "Bedroom",
      value: property.bedrooms || 0,
    },
    {
      icon: "flaticon-shower",
      label: "Bath",
      value: property.bathrooms || 0,
    },
    {
      icon: "flaticon-event",
      label: "Year Built",
      value: property.yearBuilt || "N/A",
    },
    {
      icon: "flaticon-garage",
      label: "Garage",
      value: property.garages || 0,
      xs: true,
    },
    {
      icon: "flaticon-expand",
      label: "Sqft",
      value: property.sizeInFt || 0,
      xs: true,
    },
    {
      icon: "flaticon-home-1",
      label: "Property Type",
      value: property.category?.[0] || property.structureType || "N/A",
    },
  ];
  
 
  return (
    <>
      {overviewData.map((item, index) => (
        <div
          key={index}
          className={`col-sm-6 col-lg-4 ${item.xs ? "mb25-xs" : "mb25"}`}
        >
          <div className="overview-element d-flex align-items-center">
            <span className={`icon ${item.icon}`} />
            <div className="ml15">
              <h6 className="mb-0">{item.label}</h6>
              <p className="text mb-0 fz15">{item.value}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default OverView;
