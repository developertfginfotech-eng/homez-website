"use client";
import ListingMap1 from "@/components/listing/map-style/ListingMap1";
import React, { useState, useEffect } from "react";
import { propertiesAPI } from "@/services/api";

const PropertyAddress = ({ id }) => {
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
    return <div>Property address not found</div>;
  }

  return (
    <>
      <div className="col-md-6 col-xl-6">
        <div className="d-flex justify-content-between">
          <div className="pd-list">
            <p className="fw600 mb10 ff-heading dark-color">Address</p>
            <p className="fw600 mb10 ff-heading dark-color">City</p>
            <p className="fw600 mb10 ff-heading dark-color">State/County</p>
            <p className="fw600 mb-0 ff-heading dark-color">Country</p>
          </div>
          <div className="pd-list">
            <p className="text mb10">{data.locality || 'N/A'}</p>
            <p className="text mb10">{data.city || 'N/A'}</p>
            <p className="text mb10">{data.state || 'N/A'}</p>
            <p className="text mb-0">{data.country || 'N/A'}</p>
          </div>
        </div>
      </div>
      {/* End col */}

      <div className="col-md-12 h-500" style={{height:'400px'}}>
        {data.latitude && data.longitude ? (
          <ListingMap1 properties={[{
            id: data._id,
            title: data.propertyName || data.title,
            latitude: data.latitude,
            longitude: data.longitude,
          }]} />
        ) : (
          <div className="text-center py-5 text-muted">
            Map location not available
          </div>
        )}
      </div>
      {/* End col */}
    </>
  );
};

export default PropertyAddress;
