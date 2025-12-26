import React from "react";

const PropertyFeaturesAminites = ({ property }) => {
  if (!property || !property.amenities || property.amenities.length === 0) {
    return <p className="text">No amenities listed</p>;
  }

  // Group amenities into chunks of 4 for display
  const chunkSize = 4;
  const chunkedAmenities = [];
  for (let i = 0; i < property.amenities.length; i += chunkSize) {
    chunkedAmenities.push(property.amenities.slice(i, i + chunkSize));
  }

  return (
    <>
      {chunkedAmenities.map((row, rowIndex) => (
        <div key={rowIndex} className="col-sm-6 col-md-4">
          <div className="pd-list">
            {row.map((item, index) => (
              <p key={index} className="text mb10">
                <i className="fas fa-circle fz6 align-middle pe-2" />
                {item}
              </p>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default PropertyFeaturesAminites;
