"use client";
import React, { useState, useEffect } from "react";
import { propertiesAPI } from "@/services/api";
import { useAutoTranslate, useTranslate } from "@/hooks/useTranslate";

const PropertyHeader = ({id}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslate();

  // Auto-translate property data
  const { data: translatedData, isTranslating } = useAutoTranslate(data, ['title', 'location']);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      try {
        const response = await propertiesAPI.getById(id);
        if (response.success && response.property) {
          const prop = response.property;
          // Map API data to component format
          const currency = getCurrency(prop.country);
          setData({
            id: prop._id,
            title: prop.title,
            location: `${prop.city}, ${prop.country}`,
            forRent: prop.propertyAdType === 'rent',
            yearBuilding: prop.yearBuilt || new Date().getFullYear(),
            price: `${currency} ${prop.price}`,
            sqft: prop.sizeInFt || 0,
          });
        }
      } catch (error) {
        console.error('Error fetching property:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

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

  if (loading || isTranslating) {
    return (
      <div className="col-12 text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">{loading ? 'Loading property...' : 'Translating...'}</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="col-12 text-center py-5">
        <p>Property not found</p>
      </div>
    );
  }

  const displayData = translatedData || data;

  return (
    <>
      <div className="col-lg-8">
        <div className="single-property-content mb30-md">
          <h2 className="sp-lg-title">{displayData.title}</h2>
          <div className="pd-meta mb15 d-md-flex align-items-center">
            <p className="text fz15 mb-0 bdrr1 pr10 bdrrn-sm">
              {displayData.location}
            </p>
          </div>
          <div className="property-meta d-flex align-items-center">
            <a
              className="ff-heading text-thm fz15 bdrr1 pr10 bdrrn-sm"
              href="#"
            >
              <i className="fas fa-circle fz10 pe-2" />
              {t(displayData.forRent ? 'propertyDetails.forRent' : 'propertyDetails.forSale')}
            </a>
            <a
              className="ff-heading bdrr1 fz15 pr10 ml10 ml0-sm bdrrn-sm"
              href="#"
            >
              <i className="far fa-clock pe-2" />{Number(new Date().getFullYear()) - Number(data.yearBuilding)} years ago
            </a>
            <a className="ff-heading ml10 ml0-sm fz15" href="#">
              <i className="flaticon-fullscreen pe-2 align-text-top" />
              8721
            </a>
          </div>
        </div>
      </div>
      {/* End .col-lg--8 */}

      <div className="col-lg-4">
        <div className="single-property-content">
          <div className="property-action text-lg-end">
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
            <h3 className="price mb-0">{data.price}</h3>
            <p className="text space fz15">
              {data.price && data.sqft > 0
                ? `${(Number(data.price.replace(/[^0-9.]/g, '')) / data.sqft).toFixed(2)}/sq ft`
                : 'N/A'
              }
            </p>
          </div>
        </div>
      </div>
      {/* End .col-lg--4 */}
    </>
  );
};

export default PropertyHeader;
