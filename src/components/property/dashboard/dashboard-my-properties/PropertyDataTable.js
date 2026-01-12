"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { getPropertiesByAgent, updateProperty, deleteProperty } from "@/helpers/propertyApi";

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
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});
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
                    <a href="#">${property.price?.toLocaleString()}</a>
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
            <td className="vam">${property.price?.toLocaleString() || "0"}</td>
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
                    setEditingProperty(property);
                    setEditFormData({
                      title: property.title,
                      description: property.description,
                      price: property.price,
                      propertyStatus: property.propertyStatus,
                    });
                    setShowEditModal(true);
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
      {showEditModal && editingProperty && (
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
          onClick={() => setShowEditModal(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              maxWidth: "500px",
              width: "90%",
              padding: "30px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h4 style={{ margin: 0 }}>Edit Property</h4>
              <button
                onClick={() => setShowEditModal(false)}
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

            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                setLoading(true);
                // Call update API
                const updateData = {
                  title: editFormData.title,
                  description: editFormData.description,
                  price: editFormData.price,
                  propertyStatus: editFormData.propertyStatus,
                };
                const response = await updateProperty(editingProperty._id, updateData);
                console.log("Update response:", response);
                alert("Property updated successfully!");
                setShowEditModal(false);

                // Refresh properties list
                const updatedProperties = await getPropertiesByAgent();
                if (updatedProperties.success && updatedProperties.data) {
                  setProperties(updatedProperties.data);
                } else {
                  setProperties(updatedProperties);
                }
              } catch (err) {
                console.error("Error updating property:", err);
                alert("Failed to update property: " + (err.message || err));
              } finally {
                setLoading(false);
              }
            }}>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Title</label>
                <input
                  type="text"
                  value={editFormData.title || ""}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Description</label>
                <textarea
                  value={editFormData.description || ""}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                    minHeight: "100px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Price</label>
                <input
                  type="number"
                  value={editFormData.price || ""}
                  onChange={(e) => setEditFormData({ ...editFormData, price: parseFloat(e.target.value) })}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Property Status</label>
                <select
                  value={editFormData.propertyStatus || "Pending"}
                  onChange={(e) => setEditFormData({ ...editFormData, propertyStatus: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Published">Published</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#f0f0f0",
                    color: "#333",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
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
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

            <hr style={{ margin: "15px 0" }} />

            {/* Location & Address */}
            <div style={{ marginBottom: "20px" }}>
              <h6 style={{ fontWeight: "bold", marginBottom: "10px" }}>Location & Address</h6>
              <p><strong>Address:</strong> {selectedProperty.address || "N/A"}</p>
              <p><strong>City:</strong> {selectedProperty.city || "N/A"}</p>
              <p><strong>Neighborhood:</strong> {selectedProperty.neighborhood || "N/A"}</p>
              <p><strong>Country:</strong> {selectedProperty.country || "N/A"}</p>
              <p><strong>ZIP Code:</strong> {selectedProperty.zipCode || "N/A"}</p>
            </div>

            <hr style={{ margin: "15px 0" }} />

            {/* Property Details */}
            <div style={{ marginBottom: "20px" }}>
              <h6 style={{ fontWeight: "bold", marginBottom: "10px" }}>Property Details</h6>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <p><strong>Type:</strong> {selectedProperty.propertyType || "N/A"}</p>
                <p><strong>Bedrooms:</strong> {selectedProperty.bedrooms || "N/A"}</p>
                <p><strong>Bathrooms:</strong> {selectedProperty.bathrooms || "N/A"}</p>
                <p><strong>Rooms:</strong> {selectedProperty.rooms || "N/A"}</p>
                <p><strong>Garages:</strong> {selectedProperty.garageSize || "N/A"}</p>
                <p><strong>Size:</strong> {selectedProperty.sizeInFt || "N/A"} sq ft</p>
                <p><strong>Lot Size:</strong> {selectedProperty.lotSizeInFt || "N/A"} sq ft</p>
                <p><strong>Floors:</strong> {selectedProperty.floorsNo || "N/A"}</p>
                <p><strong>Year Built:</strong> {selectedProperty.yearBuilt || "N/A"}</p>
              </div>
            </div>

            <hr style={{ margin: "15px 0" }} />

            {/* Pricing & Financial */}
            <div style={{ marginBottom: "20px" }}>
              <h6 style={{ fontWeight: "bold", marginBottom: "10px" }}>Pricing & Financial</h6>
              <p><strong>Price:</strong> ${selectedProperty.price?.toLocaleString() || "0"}</p>
              <p><strong>Yearly Tax Rate:</strong> {selectedProperty.yearlyTaxRate || "N/A"}%</p>
              <p><strong>Price Label:</strong> {selectedProperty.afterPriceLabel || "N/A"}</p>
            </div>

            <hr style={{ margin: "15px 0" }} />

            {/* Property Features */}
            <div style={{ marginBottom: "20px" }}>
              <h6 style={{ fontWeight: "bold", marginBottom: "10px" }}>Property Features</h6>
              <p><strong>Basement:</strong> {selectedProperty.basement || "N/A"}</p>
              <p><strong>Roofing:</strong> {selectedProperty.roofing || "N/A"}</p>
              <p><strong>Exterior Material:</strong> {selectedProperty.exteriorMaterial || "N/A"}</p>
              <p><strong>Energy Class:</strong> {selectedProperty.energyClass || "N/A"}</p>
              <p><strong>Energy Index:</strong> {selectedProperty.energyIndex || "N/A"}</p>
            </div>

            <hr style={{ margin: "15px 0" }} />

            {/* Additional Information */}
            <div style={{ marginBottom: "20px" }}>
              <h6 style={{ fontWeight: "bold", marginBottom: "10px" }}>Additional Information</h6>
              <p><strong>Available From:</strong> {selectedProperty.availableFrom ? new Date(selectedProperty.availableFrom).toLocaleDateString() : "N/A"}</p>
              <p><strong>Extra Details:</strong> {selectedProperty.extraDetails || "N/A"}</p>
              <p><strong>Agent Notes:</strong> {selectedProperty.ownerAgentNotes || "N/A"}</p>
              {selectedProperty.amenities && selectedProperty.amenities.length > 0 && (
                <p><strong>Amenities:</strong> {Array.isArray(selectedProperty.amenities) ? selectedProperty.amenities.join(", ") : "N/A"}</p>
              )}
            </div>

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
