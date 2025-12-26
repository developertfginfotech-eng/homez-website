"use client";
import { useEffect, useState } from "react";
import { propertyAPI } from "@/services/api";
import OverView from "../common/OverView";
import PropertyDetails from "../common/PropertyDetails";
import ProperytyDescriptions from "../common/ProperytyDescriptions";
import PropertyAddress from "../common/PropertyAddress";
import PropertyFeaturesAminites from "../common/PropertyFeaturesAminites";

const PropertyDetailWrapper = ({ id }) => {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await propertyAPI.getById(id);
        setProperty(response.property);
      } catch (err) {
        console.error("Error fetching property:", err);
        setError(err.message);
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
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        Error loading property: {error}
      </div>
    );
  }

  if (!property) {
    return (
      <div className="alert alert-warning" role="alert">
        Property not found
      </div>
    );
  }

  return (
    <>
      <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
        <h4 className="title fz17 mb30">Overview</h4>
        <div className="row">
          <OverView property={property} />
        </div>
      </div>

      <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
        <h4 className="title fz17 mb30">Property Description</h4>
        <ProperytyDescriptions property={property} />

        <h4 className="title fz17 mb30 mt50">Property Details</h4>
        <div className="row">
          <PropertyDetails property={property} />
        </div>
      </div>

      <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
        <h4 className="title fz17 mb30 mt30">Address</h4>
        <div className="row">
          <PropertyAddress property={property} />
        </div>
      </div>

      <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
        <h4 className="title fz17 mb30">Features &amp; Amenities</h4>
        <div className="row">
          <PropertyFeaturesAminites property={property} />
        </div>
      </div>
    </>
  );
};

export default PropertyDetailWrapper;
