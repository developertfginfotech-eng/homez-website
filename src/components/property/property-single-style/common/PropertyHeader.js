"use client";

import React, { useState, useEffect } from "react";
import { propertiesAPI } from "@/services/api";

const PropertyHeader = ({ id }) => {
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
    return <div>Property not found</div>;
  }
  return (
    <>
      <div className="col-lg-8">
        <div className="single-property-content mb30-md">
          <h2 className="sp-lg-title">{data.propertyName || data.title}</h2>
          <div className="pd-meta mb15 d-md-flex align-items-center">
            <p className="text fz15 mb-0 bdrr1 pr10 bdrrn-sm">
              {data.city}, {data.country}
            </p>
            <a
              className="ff-heading text-thm fz15 bdrr1 pr10 ml0-sm ml10 bdrrn-sm"
              href="#"
            >
              <i className="fas fa-circle fz10 pe-2" />
              For {data.propertyType === "Rent" ? "rent" : "sale"}
            </a>
            <a
              className="ff-heading bdrr1 fz15 pr10 ml10 ml0-sm bdrrn-sm"
              href="#"
            >
              <i className="far fa-clock pe-2" />
              {data.yearBuilt ? `${Number(new Date().getFullYear()) - Number(data.yearBuilt)} years ago` : "New"}
            </a>
            <a className="ff-heading ml10 ml0-sm fz15" href="#">
              <i className="flaticon-fullscreen pe-2 align-text-top" />
              {data.sizeInFt || 0} sqft
            </a>
          </div>
          <div className="property-meta d-flex align-items-center">
            <a className="text fz15" href="#">
              <i className="flaticon-bed pe-2 align-text-top" />
              {data.bedrooms || 0} bed
            </a>
            <a className="text ml20 fz15" href="#">
              <i className="flaticon-shower pe-2 align-text-top" />
              {data.bathrooms || 0} bath
            </a>
            <a className="text ml20 fz15" href="#">
              <i className="flaticon-expand pe-2 align-text-top" />
              {data.sizeInFt || 0} sqft
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
            <h3 className="price mb-0">${data.price?.toLocaleString() || 0}</h3>
            <p className="text space fz15">
              ${data.sizeInFt ? (data.price / data.sizeInFt).toFixed(2) : 0}/sq ft
            </p>
          </div>
        </div>
      </div>
      {/* End .col-lg--4 */}
    </>
  );
};

export default PropertyHeader;
