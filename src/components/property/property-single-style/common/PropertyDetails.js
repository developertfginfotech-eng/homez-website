import React from "react";

const PropertyDetails = ({ property }) => {
  if (!property) return null;

  const columns = [
    [
      {
        label: "Property ID",
        value: property.customId || property._id?.slice(-8) || "N/A",
      },
      {
        label: "Price",
        value: `$${property.price?.toLocaleString() || 0}`,
      },
      {
        label: "Property Size",
        value: `${property.sizeInFt || 0} Sq Ft`,
      },
      {
        label: "Bathrooms",
        value: property.bathrooms || 0,
      },
      {
        label: "Bedrooms",
        value: property.bedrooms || 0,
      },
    ],
    [
      {
        label: "Garage",
        value: property.garages || 0,
      },
      {
        label: "Garage Size",
        value: `${property.garageSize || 0} SqFt`,
      },
      {
        label: "Year Built",
        value: property.yearBuilt || "N/A",
      },
      {
        label: "Property Type",
        value: property.structureType || property.category?.[0] || "N/A",
      },
      {
        label: "Property Status",
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
