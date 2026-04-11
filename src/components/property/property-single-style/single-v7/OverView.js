"use client";

import React, { useState, useEffect } from "react";
import { getPropertyById } from "@/helpers/propertyApi";

const OverView = ({ id }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const property = await getPropertyById(id);

        const convertedData = {
          bed: property.bedrooms || 0,
          bath: property.bathrooms || 0,
          sqft: property.sizeInFt || 0,
          yearBuilding: property.yearBuilt || new Date().getFullYear(),
          propertyType: property.propertyType || "House",
        };

        setData(convertedData);
      } catch (error) {
        console.error("Error fetching property:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  if (loading || !data) {
    return null;
  }
  const overviewData = [
    {
      icon: "flaticon-bed",
      label: "Bedroom",
      value: data.bed,
    },
    {
      icon: "flaticon-shower",
      label: "Bath",
      value: data.bath,
    },
    {
      icon: "flaticon-event",
      label: "Year Built",
      value: data.yearBuilding,
    },
    {
      icon: "flaticon-garage",
      label: "Garage",
      value: "2",
    },
    {
      icon: "flaticon-expand",
      label: "Sqft",
      value: data.sqft,
    },
    {
      icon: "flaticon-home-1",
      label: "Property Type",
      value: data.propertyType,
    },
  ];
  return (
    <>
      {overviewData.map((item, index) => (
        <div key={index} className="col-sm-6 col-md-4 col-xl-2">
          <div className="overview-element dark-version mb25 d-flex align-items-center">
            <span className={`icon ${item.icon}`} />
            <div className="ml15">
              <h6 className="mb-0 text-white">{item.label}</h6>
              <p className="text mb-0 fz15 text-white">{item.value}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default OverView;
