"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { propertiesAPI } from "@/services/api";

// Country-specific currency configurations
const getCurrencySymbol = (country) => {
  const currencyMap = {
    'UAE': 'AED',
    'USA': '$',
    'Portugal': '€',
    'Canada': 'CAD',
    'Australia': 'AUD',
    'Turkey': '₺',
    'Cyprus': '€',
    'Malta': '€',
    'Hungary': 'Ft',
    'Latvia': '€',
    'Philippines': '₱',
    'Malaysia': 'RM'
  };
  return currencyMap[country] || '$';
};

const PropertyDetails = ({ property: propProperty }) => {
  const { t } = useTranslation();
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

  const columns = [
    [
      {
        label: t('propertyDetails.propertyName'),
        value: property.propertyName || "N/A",
      },
      {
        label: t('propertyDetails.propertyID'),
        value: property.customId || property._id?.slice(-8) || "N/A",
      },
      {
        label: t('listing.price'),
        value: `${getCurrencySymbol(property.country)} ${property.price?.toLocaleString() || 0}`,
      },
      {
        label: t('propertyDetails.propertySize'),
        value: `${property.sizeInFt || 0} ${t('propertyDetails.sqft')}`,
      },
      {
        label: t('propertyDetails.bathrooms'),
        value: property.bathrooms || 0,
      },
      {
        label: t('propertyDetails.bedrooms'),
        value: property.bedrooms || 0,
      },
    ],
    [
      {
        label: t('propertyDetails.garage'),
        value: property.garages || 0,
      },
      {
        label: t('propertyDetails.garageSize'),
        value: `${property.garageSize || 0} ${t('propertyDetails.sqft')}`,
      },
      {
        label: t('propertyDetails.yearBuilt'),
        value: property.yearBuilt || "N/A",
      },
      {
        label: t('propertyDetails.propertyType'),
        value: property.structureType || property.category?.[0] || "N/A",
      },
      {
        label: t('propertyDetails.propertyStatus'),
        value: property.propertyType || "N/A",
      },
    ],
  ];

  return (
    <div className="row">
      {columns.map((column, columnIndex) => (
        <div
          key={columnIndex}
          className={`col-md-6 col-xl-4${
            columnIndex === 1 ? " offset-xl-2" : ""
          }`}
        >
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
