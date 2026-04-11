"use client";

import React, { useState, useEffect } from "react";
import { getPropertyById } from "@/helpers/propertyApi";

const PropertyHeader = ({ id }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const property = await getPropertyById(id);

        // Convert API property to display format
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://homez-q5lh.onrender.com/api';
        const backendUrl = API_URL.replace('/api', '');

        const getCurrency = (country) => {
          const currencyMap = {
            'UAE': 'AED',
            'United Arab Emirates': 'AED',
            'USA': '$',
            'United States': '$',
            'US': '$',
            'UK': '£',
            'United Kingdom': '£',
            'India': '₹',
            'Europe': '€',
            'Portugal': '€',
            'Cyprus': '€',
            'Malta': '€',
            'Latvia': '€',
            'Canada': 'CAD',
            'Australia': 'AUD',
          };
          return currencyMap[country] || '$';
        };

        const currency = getCurrency(property.country);
        const convertedData = {
          id: property._id,
          title: property.title,
          price: `${currency}${property.price}`,
          location: `${property.address || ''}, ${property.city}, ${property.country}`,
          city: property.city,
          country: property.country,
          bed: property.bedrooms || 0,
          bath: property.bathrooms || 0,
          sqft: property.sizeInFt || 0,
          yearBuilding: property.yearBuilt || new Date().getFullYear(),
          propertyType: property.propertyType || "House",
          forRent: property.propertyAdType === "rent",
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

  if (loading) {
    return (
      <div className="col-lg-12 text-center">
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="col-lg-12 text-center text-white">
        <p>Property not found</p>
      </div>
    );
  }
  return (
    <>
      <div className="col-lg-8">
        <div className="single-property-content mb30-md">
          <h2 className="sp-lg-title text-white">{data.title}</h2>
          <div className="pd-meta mb15 d-md-flex align-items-center">
            <p className="text text-white fz15 mb-0 pr10 bdrrn-sm">
              {data.location}
            </p>
          </div>
          <div className="property-meta d-flex align-items-center">
            <a
              className="ff-heading text-thm fz15 bdrr1 pr10 bdrrn-sm"
              href="#"
            >
              <i className="fas fa-circle fz10 pe-2" />
              {data.forRent ? 'For rent' : 'For sale'}
            </a>
            <a className="ff-heading text-white ml10 ml0-sm fz15" href="#">
              <i className="flaticon-fullscreen pe-2 align-text-top" />
              {data.sqft}
            </a>
          </div>
        </div>
      </div>
      {/* End .col-lg--8 */}

      <div className="col-lg-4">
        <div className="single-property-content">
          <div className="property-action dark-version text-lg-end">
            <div className="d-flex mb20 mb10-md align-items-center justify-content-lg-end">
              <a className="icon mr10" href="#">
                <span className="flaticon-like" />
              </a>
              <a className="icon mr10" href="#">
                <span className="flaticon-new-tab" />
              </a>
              <a className="icon mr10" href="#">
                <span className="flaticon-share-1" />
              </a>
              <a className="icon" href="#">
                <span className="flaticon-printer" />
              </a>
            </div>
            <h3 className="price mb-0 text-white">{data.price}</h3>
            <p className="text space fz15 text-white">
              {data.sqft > 0 ? (
                <>
                  {data.price.match(/[^\d.,]/g)?.[0] || '$'}
                  {(
                    Number(data.price.replace(/[^\d.]/g, '')) / data.sqft
                  ).toFixed(2)}
                  /sq ft
                </>
              ) : (
                'N/A'
              )}
            </p>
          </div>
        </div>
      </div>
      {/* End .col-lg--4 */}
    </>
  );
};

export default PropertyHeader;
