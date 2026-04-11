"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { getPropertiesByAgent, updateProperty, deleteProperty } from "@/helpers/propertyApi";

// Country-specific address field configurations
const getAddressFieldConfig = (country) => {
  const configs = {
    'UAE': { cityLabel: 'Area', hasPostalCode: false },
    'USA': { cityLabel: 'City', hasPostalCode: true, postalCodeLabel: 'ZIP Code' },
    'Portugal': { cityLabel: 'Municipality', hasPostalCode: true, postalCodeLabel: 'Postal Code' },
    'Canada': { cityLabel: 'City', hasPostalCode: true, postalCodeLabel: 'Postal Code' },
    'Australia': { cityLabel: 'City/Suburb', hasPostalCode: true, postalCodeLabel: 'Postcode' },
    'Turkey': { cityLabel: 'District', hasPostalCode: true, postalCodeLabel: 'Postal Code' },
    'Cyprus': { cityLabel: 'Town', hasPostalCode: true, postalCodeLabel: 'Postal Code' },
    'Malta': { cityLabel: 'Locality', hasPostalCode: false },
    'Hungary': { cityLabel: 'City', hasPostalCode: true, postalCodeLabel: 'Postal Code' },
    'Latvia': { cityLabel: 'City/Town', hasPostalCode: true, postalCodeLabel: 'Postal Code' },
    'Philippines': { cityLabel: 'City/Municipality', hasPostalCode: true, postalCodeLabel: 'ZIP Code' },
    'Malaysia': { cityLabel: 'City', hasPostalCode: true, postalCodeLabel: 'Postcode' }
  };
  return configs[country] || { cityLabel: 'City', hasPostalCode: true, postalCodeLabel: 'Postal Code' };
};

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

const getStatusStyle = (status) => {
  switch (status) {
    case "pending":
      return "pending-style style1";
    case "approved":
      return "pending-style style2";
    case "rejected":
      return "pending-style style3";
    case "Pending":
      return "pending-style style1";
    case "Published":
      return "pending-style style2";
    case "Processing":
      return "pending-style style3";
    default:
      return "";
  }
};

// Format amenities from camelCase to readable format
const formatAmenityName = (amenity) => {
  const amenityNames = {
    powerBackup: 'Power Backup',
    lift: 'Lift/Elevator',
    parking: 'Parking',
    waterStorage: 'Water Storage',
    security: 'Security',
    gym: 'Gym/Fitness Center',
    swimmingPool: 'Swimming Pool',
    garden: 'Garden',
    clubHouse: 'Club House',
    internetWifi: 'Internet/WiFi'
  };
  return amenityNames[amenity] || amenity.charAt(0).toUpperCase() + amenity.slice(1).replace(/([A-Z])/g, ' $1');
};

const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const ITEMS_PER_PAGE = 10;

const PropertyDataTable = () => {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [deletingProperty, setDeletingProperty] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await getPropertiesByAgent();
        if (response.success && response.data) {
          setProperties(response.data);
          setCurrentPage(1);
        } else {
          const errorMsg = response.error || "Failed to fetch properties";
          if (errorMsg.includes("401") || errorMsg.includes("Unauthorized")) {
            setError("You must be logged in to view your properties. Please log in first.");
          } else {
            setError(errorMsg);
          }
        }
      } catch (err) {
        setError(err.message || "Failed to fetch properties");
        console.error("Error fetching properties:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();

    // Listen for currency changes to update display
    const handleCurrencyChange = () => {
      setCurrencyUpdate(prev => prev + 1); // Trigger re-render
    };

    window.addEventListener('currencyChanged', handleCurrencyChange);
    return () => {
      window.removeEventListener('currencyChanged', handleCurrencyChange);
    };
  }, []);

  // Calculate pagination
  const totalPages = Math.ceil(properties.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProperties = properties.slice(startIndex, endIndex);
  const showPagination = properties.length > ITEMS_PER_PAGE;

  if (loading) {
    return (
      <div className="text-center py-5">
        <p>Loading properties...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-5">
        <p>No properties found. Start by adding your first property!</p>
      </div>
    );
  }

  return (
    <>
      <table className="table-style3 table at-savesearch">
        <thead className="t-head">
          <tr>
            <th scope="col">Listing title</th>
            <th scope="col">Date Published</th>
            <th scope="col">Status</th>
            <th scope="col">Price</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody className="t-body">
          {currentProperties.map((property) => (
          <tr key={property._id}>
            <th scope="row">
              <div className="listing-style1 dashboard-style d-xxl-flex align-items-center mb-0">
                <div className="list-thumb">
                  <Image
                    width={110}
                    height={94}
                    className="w-100"
                    src={
                      property.images && property.images.length > 0
                        ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${property.images[0]}`
                        : "/images/listings/list-1.jpg"
                    }
                    alt={property.propertyName || property.title}
                    onError={(e) => {
                      e.currentTarget.src = "/images/listings/list-1.jpg";
                    }}
                  />
                </div>
                <div className="list-content py-0 p-0 mt-2 mt-xxl-0 ps-xxl-4">
                  <div className="h6 list-title">
                    <Link href={`/single-v1/${property._id}`}>{property.propertyName || property.title}</Link>
                  </div>
                  <p className="list-text mb-0">
                    {property.address}, {property.city}, {property.country}
                  </p>
                  <div className="list-price">
                    <a href="#">{getCurrencySymbol(property.country)} {property.price?.toLocaleString()}</a>
                  </div>
                </div>
              </div>
            </th>
            <td className="vam">{formatDate(property.createdAt)}</td>
            <td className="vam">
              <span className={getStatusStyle(property.approvalStatus || property.propertyStatus)}>
                {property.approvalStatus || property.propertyStatus || "Pending"}
              </span>
            </td>
            <td className="vam">{getCurrencySymbol(property.country)} {property.price?.toLocaleString() || "0"}</td>
            <td className="vam">
              <div className="d-flex">
                <button
                  className="icon"
                  style={{ border: "none" }}
                  onClick={() => {
                    setSelectedProperty(property);
                    setShowDetailsModal(true);
                  }}
                  data-tooltip-id={`view-${property._id}`}
                  title="View Details"
                >
                  <span className="fas fa-eye" />
                </button>
                <button
                  className="icon"
                  style={{ border: "none" }}
                  onClick={() => {
                    router.push(`/dashboard-edit-property/${property._id}`);
                  }}
                  data-tooltip-id={`edit-${property._id}`}
                  title="Edit Property"
                >
                  <span className="fas fa-pen fa" />
                </button>
                <button
                  className="icon"
                  style={{ border: "none" }}
                  onClick={() => {
                    setDeletingProperty(property);
                    setShowDeleteConfirm(true);
                  }}
                  data-tooltip-id={`delete-${property._id}`}
                  title="Delete Property"
                >
                  <span className="flaticon-bin" />
                </button>

                <ReactTooltip
                  id={`view-${property._id}`}
                  place="top"
                  content="View Details"
                />
                <ReactTooltip
                  id={`edit-${property._id}`}
                  place="top"
                  content="Edit"
                />
                <ReactTooltip
                  id={`delete-${property._id}`}
                  place="top"
                  content="Delete"
                />
              </div>
            </td>
          </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && deletingProperty && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              maxWidth: "400px",
              width: "90%",
              padding: "30px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h4 style={{ marginBottom: "15px", color: "#d32f2f" }}>Delete Property?</h4>
            <p style={{ marginBottom: "20px", color: "#666" }}>
              Are you sure you want to delete <strong>"{deletingProperty.propertyName || deletingProperty.title}"</strong>? This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#f0f0f0",
                  color: "#333",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                  minWidth: "100px",
                }}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    setLoading(true);
                    await deleteProperty(deletingProperty._id);
                    alert("Property deleted successfully!");
                    setShowDeleteConfirm(false);

                    // Refresh properties list
                    const updatedProperties = await getPropertiesByAgent();
                    if (updatedProperties.success && updatedProperties.data) {
                      setProperties(updatedProperties.data);
                    } else {
                      setProperties(updatedProperties);
                    }
                  } catch (err) {
                    console.error("Error deleting property:", err);
                    alert("Failed to delete property: " + (err.message || err));
                  } finally {
                    setLoading(false);
                  }
                }}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#d32f2f",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                  minWidth: "100px",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedProperty && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
          onClick={() => setShowDetailsModal(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              maxWidth: "600px",
              maxHeight: "80vh",
              overflowY: "auto",
              padding: "30px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h4 style={{ margin: 0 }}>{selectedProperty.propertyName || selectedProperty.title}</h4>
              <button
                onClick={() => setShowDetailsModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "#666",
                }}
              >
                ×
              </button>
            </div>

            {/* Basic Information */}
            <div style={{ marginBottom: "20px" }}>
              <h6 style={{ fontWeight: "bold", marginBottom: "10px" }}>Basic Information</h6>
              <p><strong>Property Name:</strong> {selectedProperty.propertyName || "N/A"}</p>
              <p><strong>Title:</strong> {selectedProperty.title}</p>
              <p><strong>Description:</strong> {selectedProperty.description || "N/A"}</p>
              <p><strong>Category:</strong> {selectedProperty.structureType || selectedProperty.category || "N/A"}</p>
              <p><strong>Status:</strong> <span style={{ padding: "4px 8px", borderRadius: "4px", backgroundColor: (selectedProperty.approvalStatus || selectedProperty.propertyStatus) === "pending" ? "#fff3cd" : (selectedProperty.approvalStatus || selectedProperty.propertyStatus) === "approved" ? "#d4edda" : (selectedProperty.approvalStatus || selectedProperty.propertyStatus) === "Published" ? "#d4edda" : "#f8d7da", color: (selectedProperty.approvalStatus || selectedProperty.propertyStatus) === "pending" ? "#856404" : (selectedProperty.approvalStatus || selectedProperty.propertyStatus) === "approved" ? "#155724" : (selectedProperty.approvalStatus || selectedProperty.propertyStatus) === "Published" ? "#155724" : "#721c24" }}>{selectedProperty.approvalStatus || selectedProperty.propertyStatus || "Pending"}</span></p>
            </div>

            {/* Rejection Reason Alert */}
            {(selectedProperty.approvalStatus === 'rejected' || selectedProperty.propertyStatus === 'rejected') && selectedProperty.approvalReason && (
              <div style={{
                marginBottom: "20px",
                padding: "15px",
                backgroundColor: "#fee",
                border: "1px solid #fcc",
                borderRadius: "8px",
                borderLeft: "4px solid #f44"
              }}>
                <div style={{ display: "flex", alignItems: "start", gap: "10px" }}>
                  <span style={{ color: "#f44", fontSize: "20px" }}>⚠️</span>
                  <div>
                    <h6 style={{ margin: "0 0 8px 0", color: "#c33", fontWeight: "bold" }}>Property Rejected</h6>
                    <p style={{ margin: 0, color: "#666" }}><strong>Reason:</strong> {selectedProperty.approvalReason}</p>
                    <p style={{ margin: "10px 0 0 0", fontSize: "14px", color: "#888" }}>
                      Please edit your property to address these concerns and resubmit for approval.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <hr style={{ margin: "15px 0" }} />

            {/* Property Images */}
            {selectedProperty.images && selectedProperty.images.length > 0 && (
              <>
                <div style={{ marginBottom: "20px" }}>
                  <h6 style={{ fontWeight: "bold", marginBottom: "10px" }}>Property Images ({selectedProperty.images.length})</h6>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "10px" }}>
                    {selectedProperty.images.map((image, index) => {
                      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://homez-q5lh.onrender.com/api';
                      const backendUrl = API_URL.replace('/api', '');
                      const imageUrl = image.startsWith('http') ? image : `${backendUrl}${image}`;

                      return (
                        <div key={index} style={{ position: "relative", paddingBottom: "100%", overflow: "hidden", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                          <img
                            src={imageUrl}
                            alt={`Property ${index + 1}`}
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              cursor: "pointer"
                            }}
                            onClick={() => window.open(imageUrl, '_blank')}
                          />
                          <div style={{
                            position: "absolute",
                            top: "5px",
                            right: "5px",
                            display: "flex",
                            gap: "5px"
                          }}>
                            <a
                              href={imageUrl}
                              download={`property-image-${index + 1}`}
                              style={{
                                backgroundColor: "rgba(0, 0, 0, 0.7)",
                                color: "white",
                                padding: "5px 8px",
                                borderRadius: "4px",
                                fontSize: "12px",
                                textDecoration: "none",
                                display: "flex",
                                alignItems: "center",
                                gap: "3px",
                                cursor: "pointer"
                              }}
                              title="Download image"
                            >
                              <i className="fas fa-download"></i>
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <hr style={{ margin: "15px 0" }} />
              </>
            )}

            {selectedProperty.photos && selectedProperty.photos.length > 0 && !(selectedProperty.images && selectedProperty.images.length > 0) && (
              <>
                <div style={{ marginBottom: "20px" }}>
                  <h6 style={{ fontWeight: "bold", marginBottom: "10px" }}>Property Photos ({selectedProperty.photos.length})</h6>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "10px" }}>
                    {selectedProperty.photos.map((photo, index) => {
                      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://homez-q5lh.onrender.com/api';
                      const backendUrl = API_URL.replace('/api', '');
                      const photoUrl = photo.startsWith('http') ? photo : `${backendUrl}${photo}`;

                      return (
                        <div key={index} style={{ position: "relative", paddingBottom: "100%", overflow: "hidden", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                          <img
                            src={photoUrl}
                            alt={`Photo ${index + 1}`}
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              cursor: "pointer"
                            }}
                            onClick={() => window.open(photoUrl, '_blank')}
                          />
                          <div style={{
                            position: "absolute",
                            top: "5px",
                            right: "5px",
                            display: "flex",
                            gap: "5px"
                          }}>
                            <a
                              href={photoUrl}
                              download={`property-photo-${index + 1}`}
                              style={{
                                backgroundColor: "rgba(0, 0, 0, 0.7)",
                                color: "white",
                                padding: "5px 8px",
                                borderRadius: "4px",
                                fontSize: "12px",
                                textDecoration: "none",
                                display: "flex",
                                alignItems: "center",
                                gap: "3px",
                                cursor: "pointer"
                              }}
                              title="Download photo"
                            >
                              <i className="fas fa-download"></i>
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <hr style={{ margin: "15px 0" }} />
              </>
            )}

            <hr style={{ margin: "15px 0" }} />

            {/* Location & Address */}
            <div style={{ marginBottom: "20px" }}>
              <h6 style={{ fontWeight: "bold", marginBottom: "10px" }}>Location & Address</h6>
              {selectedProperty.address && <p><strong>Address:</strong> {selectedProperty.address}</p>}
              {selectedProperty.city && <p><strong>{getAddressFieldConfig(selectedProperty.country).cityLabel}:</strong> {selectedProperty.city}</p>}
              {selectedProperty.neighborhood && <p><strong>Neighborhood:</strong> {selectedProperty.neighborhood}</p>}
              {selectedProperty.country && <p><strong>Country:</strong> {selectedProperty.country}</p>}
              {getAddressFieldConfig(selectedProperty.country).hasPostalCode && selectedProperty.zipCode && (
                <p><strong>{getAddressFieldConfig(selectedProperty.country).postalCodeLabel}:</strong> {selectedProperty.zipCode}</p>
              )}
            </div>

            <hr style={{ margin: "15px 0" }} />

            {/* Property Details */}
            <div style={{ marginBottom: "20px" }}>
              <h6 style={{ fontWeight: "bold", marginBottom: "10px" }}>Property Details</h6>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {selectedProperty.propertyType && <p><strong>Type:</strong> {selectedProperty.propertyType}</p>}
                {(selectedProperty.bedrooms || selectedProperty.beds) && <p><strong>Bedrooms:</strong> {selectedProperty.bedrooms || selectedProperty.beds}</p>}
                {(selectedProperty.bathrooms || selectedProperty.bath) && <p><strong>Bathrooms:</strong> {selectedProperty.bathrooms || selectedProperty.bath}</p>}
                {selectedProperty.balconies && <p><strong>Balconies:</strong> {selectedProperty.balconies}</p>}
                {selectedProperty.rooms && <p><strong>Rooms:</strong> {selectedProperty.rooms}</p>}
                {(selectedProperty.garageSize || selectedProperty.garages) && <p><strong>Garages:</strong> {selectedProperty.garageSize || selectedProperty.garages}</p>}
                {(selectedProperty.sizeInFt || selectedProperty.superBuiltUpArea) && <p><strong>Size:</strong> {selectedProperty.sizeInFt || selectedProperty.superBuiltUpArea} sq ft</p>}
                {selectedProperty.carpetArea && <p><strong>Carpet Area:</strong> {selectedProperty.carpetArea} sq ft</p>}
                {(selectedProperty.lotSizeInFt || selectedProperty.plotArea) && <p><strong>Lot/Plot Size:</strong> {selectedProperty.lotSizeInFt || selectedProperty.plotArea} sq ft</p>}
                {(selectedProperty.floorsNo || selectedProperty.floor) && <p><strong>Floor:</strong> {selectedProperty.floor || selectedProperty.floorsNo}</p>}
                {selectedProperty.totalFloor && <p><strong>Total Floors:</strong> {selectedProperty.totalFloor}</p>}
                {selectedProperty.yearBuilt && <p><strong>Year Built:</strong> {selectedProperty.yearBuilt}</p>}
                {selectedProperty.propertyAge && <p><strong>Property Age:</strong> {selectedProperty.propertyAge} years</p>}
                {selectedProperty.buildingType && <p><strong>Building Type:</strong> {selectedProperty.buildingType}</p>}
                {selectedProperty.furnishing && <p><strong>Furnishing:</strong> {selectedProperty.furnishing}</p>}
              </div>
            </div>

            <hr style={{ margin: "15px 0" }} />

            {/* Pricing & Financial */}
            <div style={{ marginBottom: "20px" }}>
              <h6 style={{ fontWeight: "bold", marginBottom: "10px" }}>Pricing & Financial</h6>
              <p><strong>Price:</strong> {getCurrencySymbol(selectedProperty.country)} {(selectedProperty.price || selectedProperty.expectedPrice)?.toLocaleString() || "0"}</p>
              {selectedProperty.priceNegotiable !== undefined && <p><strong>Price Negotiable:</strong> {selectedProperty.priceNegotiable ? 'Yes' : 'No'}</p>}
              {selectedProperty.ownershipType && <p><strong>Ownership Type:</strong> {selectedProperty.ownershipType}</p>}
              {selectedProperty.securityDeposit && <p><strong>Security Deposit:</strong> {getCurrencySymbol(selectedProperty.country)} {selectedProperty.securityDeposit?.toLocaleString()}</p>}
              {selectedProperty.maintenanceCharge && <p><strong>Maintenance Charge:</strong> {getCurrencySymbol(selectedProperty.country)} {selectedProperty.maintenanceCharge?.toLocaleString()}</p>}
              {selectedProperty.yearlyTaxRate && <p><strong>Yearly Tax Rate:</strong> {selectedProperty.yearlyTaxRate}%</p>}
              {selectedProperty.afterPriceLabel && <p><strong>Price Label:</strong> {selectedProperty.afterPriceLabel}</p>}
            </div>

            <hr style={{ margin: "15px 0" }} />

            {/* Property Features */}
            {(selectedProperty.basement || selectedProperty.roofing || selectedProperty.exteriorMaterial || selectedProperty.energyClass || selectedProperty.energyIndex) && (
              <div style={{ marginBottom: "20px" }}>
                <h6 style={{ fontWeight: "bold", marginBottom: "10px" }}>Property Features</h6>
                {selectedProperty.basement && <p><strong>Basement:</strong> {selectedProperty.basement}</p>}
                {selectedProperty.roofing && <p><strong>Roofing:</strong> {selectedProperty.roofing}</p>}
                {selectedProperty.exteriorMaterial && <p><strong>Exterior Material:</strong> {selectedProperty.exteriorMaterial}</p>}
                {selectedProperty.energyClass && <p><strong>Energy Class:</strong> {selectedProperty.energyClass}</p>}
                {selectedProperty.energyIndex && <p><strong>Energy Index:</strong> {selectedProperty.energyIndex}</p>}
              </div>
            )}

            <hr style={{ margin: "15px 0" }} />

            {/* Additional Information */}
            <div style={{ marginBottom: "20px" }}>
              <h6 style={{ fontWeight: "bold", marginBottom: "10px" }}>Additional Information</h6>
              {selectedProperty.availableFrom && <p><strong>Available From:</strong> {new Date(selectedProperty.availableFrom).toLocaleDateString()}</p>}
              {selectedProperty.extraDetails && <p><strong>Extra Details:</strong> {selectedProperty.extraDetails}</p>}
              {selectedProperty.ownerAgentNotes && <p><strong>Agent Notes:</strong> {selectedProperty.ownerAgentNotes}</p>}
            </div>

            {/* Amenities Section */}
            {selectedProperty.amenities && selectedProperty.amenities.length > 0 && (
              <>
                <hr style={{ margin: "15px 0" }} />
                <div style={{ marginBottom: "20px" }}>
                  <h6 style={{ fontWeight: "bold", marginBottom: "10px" }}>Amenities</h6>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {Array.isArray(selectedProperty.amenities) ?
                      selectedProperty.amenities.map((amenity, index) => (
                        <span
                          key={index}
                          style={{
                            padding: "6px 12px",
                            backgroundColor: "#f3f4f6",
                            borderRadius: "6px",
                            fontSize: "14px",
                            color: "#374151",
                            border: "1px solid #e5e7eb"
                          }}
                        >
                          {formatAmenityName(amenity)}
                        </span>
                      )) : selectedProperty.amenities
                    }
                  </div>
                </div>
              </>
            )}

            {/* Boolean Amenities from Property Model */}
            {(selectedProperty.powerBackup || selectedProperty.lift || selectedProperty.parking ||
              selectedProperty.waterStorage || selectedProperty.security || selectedProperty.gym ||
              selectedProperty.swimmingPool || selectedProperty.garden || selectedProperty.clubHouse ||
              selectedProperty.internetWifi) && (
              <>
                <hr style={{ margin: "15px 0" }} />
                <div style={{ marginBottom: "20px" }}>
                  <h6 style={{ fontWeight: "bold", marginBottom: "10px" }}>Property Amenities</h6>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {selectedProperty.powerBackup && <span style={{ padding: "6px 12px", backgroundColor: "#dcfce7", borderRadius: "6px", fontSize: "14px", color: "#166534", border: "1px solid #bbf7d0" }}>✓ Power Backup</span>}
                    {selectedProperty.lift && <span style={{ padding: "6px 12px", backgroundColor: "#dcfce7", borderRadius: "6px", fontSize: "14px", color: "#166534", border: "1px solid #bbf7d0" }}>✓ Lift/Elevator</span>}
                    {selectedProperty.parking && <span style={{ padding: "6px 12px", backgroundColor: "#dcfce7", borderRadius: "6px", fontSize: "14px", color: "#166534", border: "1px solid #bbf7d0" }}>✓ Parking ({selectedProperty.parking})</span>}
                    {selectedProperty.waterStorage && <span style={{ padding: "6px 12px", backgroundColor: "#dcfce7", borderRadius: "6px", fontSize: "14px", color: "#166534", border: "1px solid #bbf7d0" }}>✓ Water Storage</span>}
                    {selectedProperty.security && <span style={{ padding: "6px 12px", backgroundColor: "#dcfce7", borderRadius: "6px", fontSize: "14px", color: "#166534", border: "1px solid #bbf7d0" }}>✓ Security</span>}
                    {selectedProperty.gym && <span style={{ padding: "6px 12px", backgroundColor: "#dcfce7", borderRadius: "6px", fontSize: "14px", color: "#166534", border: "1px solid #bbf7d0" }}>✓ Gym/Fitness Center</span>}
                    {selectedProperty.swimmingPool && <span style={{ padding: "6px 12px", backgroundColor: "#dcfce7", borderRadius: "6px", fontSize: "14px", color: "#166534", border: "1px solid #bbf7d0" }}>✓ Swimming Pool</span>}
                    {selectedProperty.garden && <span style={{ padding: "6px 12px", backgroundColor: "#dcfce7", borderRadius: "6px", fontSize: "14px", color: "#166534", border: "1px solid #bbf7d0" }}>✓ Garden</span>}
                    {selectedProperty.clubHouse && <span style={{ padding: "6px 12px", backgroundColor: "#dcfce7", borderRadius: "6px", fontSize: "14px", color: "#166534", border: "1px solid #bbf7d0" }}>✓ Club House</span>}
                    {selectedProperty.internetWifi && <span style={{ padding: "6px 12px", backgroundColor: "#dcfce7", borderRadius: "6px", fontSize: "14px", color: "#166534", border: "1px solid #bbf7d0" }}>✓ Internet/WiFi</span>}
                  </div>
                </div>
              </>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
              <button
                onClick={() => setShowDetailsModal(false)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#eb6753",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Show pagination only if there are multiple pages */}
      {showPagination && (
        <div style={{ marginTop: "30px", display: "flex", justifyContent: "center", gap: "10px" }}>
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            style={{
              padding: "8px 12px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              opacity: currentPage === 1 ? 0.5 : 1,
            }}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              style={{
                padding: "8px 12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                backgroundColor: currentPage === page ? "#eb6753" : "transparent",
                color: currentPage === page ? "white" : "black",
                cursor: "pointer",
              }}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            style={{
              padding: "8px 12px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              opacity: currentPage === totalPages ? 0.5 : 1,
            }}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default PropertyDataTable;
