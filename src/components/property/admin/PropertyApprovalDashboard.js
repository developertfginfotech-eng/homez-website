"use client";
import React, { useEffect, useState } from "react";
import {
  getPendingProperties,
  getPropertiesForApproval,
  approveProperty,
  rejectProperty,
} from "@/helpers/adminPropertyApi";
import FraudDetectionWidget from "@/components/property/admin/FraudDetectionWidget";

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

const PropertyApprovalDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filterStatus, setFilterStatus] = useState("pending");
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [viewingProperty, setViewingProperty] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currencyUpdate, setCurrencyUpdate] = useState(0);

  // Fetch properties
  const fetchProperties = async (status = "pending") => {
    try {
      setLoading(true);
      setError("");

      // Check if user is logged in
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError("You must be logged in to view properties. Please log in as an admin.");
        setLoading(false);
        return;
      }

      console.log('Fetching properties for status:', status);
      const data = await getPropertiesForApproval(status);
      console.log('Received properties:', data);
      setProperties(data);
    } catch (err) {
      const errorMessage = err.message || err.error || "Failed to fetch properties from API";
      setError(`API Error: ${errorMessage}`);
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties(filterStatus);

    // Listen for currency changes to update display
    const handleCurrencyChange = () => {
      setCurrencyUpdate(prev => prev + 1); // Trigger re-render
    };

    window.addEventListener('currencyChanged', handleCurrencyChange);
    return () => {
      window.removeEventListener('currencyChanged', handleCurrencyChange);
    };
  }, [filterStatus]);

  // Handle approve
  const handleApprove = async (propertyId) => {
    try {
      setLoading(true);
      await approveProperty(propertyId);
      setSuccess("Property approved successfully!");
      fetchProperties(filterStatus);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to approve property");
      console.error("Approve error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle reject
  const handleReject = async (propertyId) => {
    if (!rejectReason.trim()) {
      setError("Please provide a rejection reason");
      return;
    }

    try {
      setLoading(true);
      await rejectProperty(propertyId, rejectReason);
      setSuccess("Property rejected successfully!");
      setRejectingId(null);
      setRejectReason("");
      fetchProperties(filterStatus);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to reject property");
      console.error("Reject error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ps-widget bgc-white bdrs12 p30 overflow-hidden position-relative">
      <h4 className="title fz17 mb30">Property Approval Management</h4>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError("")}
          ></button>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {success}
          <button
            type="button"
            className="btn-close"
            onClick={() => setSuccess("")}
          ></button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="mb30">
        <div className="nav nav-tabs" role="tablist">
          <button
            className={`nav-link ${filterStatus === "pending" ? "active" : ""}`}
            onClick={() => setFilterStatus("pending")}
            type="button"
          >
            Pending ({properties.filter((p) => p.approvalStatus === "pending").length})
          </button>
          <button
            className={`nav-link ${filterStatus === "approved" ? "active" : ""}`}
            onClick={() => setFilterStatus("approved")}
            type="button"
          >
            Approved ({properties.filter((p) => p.approvalStatus === "approved").length})
          </button>
          <button
            className={`nav-link ${filterStatus === "rejected" ? "active" : ""}`}
            onClick={() => setFilterStatus("rejected")}
            type="button"
          >
            Rejected ({properties.filter((p) => p.approvalStatus === "rejected").length})
          </button>
          <button
            className={`nav-link ${filterStatus === "all" ? "active" : ""}`}
            onClick={() => setFilterStatus("all")}
            type="button"
          >
            All
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Properties Table */}
      {!loading && properties.length > 0 && (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Property</th>
                <th>Agent</th>
                <th>Price</th>
                <th>Status</th>
                <th>Added</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <React.Fragment key={property._id}>
                  <tr>
                    <td>
                      <strong>{property.title}</strong>
                      <br />
                      <small className="text-muted">{property.city}, {property.country}</small>
                    </td>
                    <td>
                      {property.agentId?.name}
                      <br />
                      <small className="text-muted">{property.agentId?.email}</small>
                    </td>
                    <td>{getCurrencySymbol(property.country)} {property.price?.toLocaleString()}</td>
                    <td>
                      <span
                        className={`badge ${
                          property.approvalStatus === "pending"
                            ? "bg-warning"
                            : property.approvalStatus === "approved"
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                      >
                        {property.approvalStatus}
                      </span>
                    </td>
                    <td>
                      <small>
                        {new Date(property.createdAt).toLocaleDateString()}
                      </small>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-info mb-2"
                        onClick={() => {
                          setViewingProperty(property);
                          setShowDetailsModal(true);
                        }}
                        style={{ width: '100%' }}
                      >
                        👁 View Details
                      </button>
                      <FraudDetectionWidget property={property} />
                      {property.approvalStatus === "pending" && (
                        <div className="btn-group" role="group" style={{ width: '100%' }}>
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleApprove(property._id)}
                            disabled={loading}
                          >
                            ✓ Approve
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => setRejectingId(property._id)}
                            disabled={loading}
                          >
                            ✕ Reject
                          </button>
                        </div>
                      )}
                      {property.approvalStatus === "approved" && (
                        <span className="badge bg-success">Approved</span>
                      )}
                      {property.approvalStatus === "rejected" && (
                        <span className="badge bg-danger">Rejected</span>
                      )}
                    </td>
                  </tr>

                  {/* Reject Reason Modal Row */}
                  {rejectingId === property._id && (
                    <tr>
                      <td colSpan="6">
                        <div className="p-3 bg-light">
                          <div className="mb-3">
                            <label className="form-label">Rejection Reason:</label>
                            <textarea
                              className="form-control"
                              rows="3"
                              placeholder="Enter reason for rejection..."
                              value={rejectReason}
                              onChange={(e) => setRejectReason(e.target.value)}
                            />
                          </div>
                          <div className="btn-group" role="group">
                            <button
                              className="btn btn-danger"
                              onClick={() => handleReject(property._id)}
                              disabled={loading}
                            >
                              Confirm Rejection
                            </button>
                            <button
                              className="btn btn-secondary"
                              onClick={() => {
                                setRejectingId(null);
                                setRejectReason("");
                              }}
                              disabled={loading}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* No Properties */}
      {!loading && properties.length === 0 && (
        <div className="text-center py-5">
          <p className="text-muted">No properties found for this status.</p>
        </div>
      )}

      {/* Property Details Modal */}
      {showDetailsModal && viewingProperty && (
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
            padding: "20px"
          }}
          onClick={() => setShowDetailsModal(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              maxWidth: "1200px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "30px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", borderBottom: "2px solid #e5e7eb", paddingBottom: "15px" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "24px", fontWeight: "700", color: "#1f2937" }}>
                  {viewingProperty.propertyName || viewingProperty.title}
                </h3>
                <p style={{ margin: "5px 0 0 0", color: "#6b7280" }}>
                  Property ID: {viewingProperty._id}
                </p>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "32px",
                  cursor: "pointer",
                  color: "#9ca3af",
                  lineHeight: "1"
                }}
              >
                ×
              </button>
            </div>

            {/* Agent/User Information */}
            <div style={{ marginBottom: "25px", padding: "25px", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", borderRadius: "12px", border: "2px solid #5a67d8", boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)" }}>
              <h5 style={{ marginBottom: "18px", fontSize: "20px", fontWeight: "800", color: "white", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                <i className="fas fa-user-circle" style={{ marginRight: "10px", fontSize: "24px" }}></i>
                Property Submitted By
              </h5>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div>
                  <p style={{ margin: "8px 0", color: "white", fontSize: "15px" }}>
                    <strong style={{ color: "#e0e7ff" }}>Name:</strong> <span style={{ marginLeft: "8px", fontWeight: "600" }}>{viewingProperty.agentId?.name || "N/A"}</span>
                  </p>
                  <p style={{ margin: "8px 0", color: "white", fontSize: "15px" }}>
                    <strong style={{ color: "#e0e7ff" }}>Email:</strong> <span style={{ marginLeft: "8px", fontWeight: "600" }}>{viewingProperty.agentId?.email || "N/A"}</span>
                  </p>
                </div>
                <div>
                  <p style={{ margin: "8px 0", color: "white", fontSize: "15px" }}>
                    <strong style={{ color: "#e0e7ff" }}>Account Type:</strong>
                    <span style={{
                      marginLeft: "8px",
                      padding: "6px 14px",
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      color: viewingProperty.agentId?.role === 'admin' ? '#7c3aed' : viewingProperty.agentId?.role === 'broker' ? '#dc2626' : '#059669',
                      borderRadius: "20px",
                      fontSize: "13px",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      display: "inline-block"
                    }}>
                      {viewingProperty.agentId?.role || "N/A"}
                    </span>
                  </p>
                  <p style={{ margin: "8px 0", color: "white", fontSize: "15px" }}>
                    <strong style={{ color: "#e0e7ff" }}>Country:</strong> <span style={{ marginLeft: "8px", fontWeight: "600" }}>{viewingProperty.agentId?.country || "N/A"}</span>
                  </p>
                  <p style={{ margin: "8px 0", color: "white", fontSize: "14px", opacity: "0.9" }}>
                    <strong style={{ color: "#e0e7ff" }}>Submitted:</strong> <span style={{ marginLeft: "8px" }}>{new Date(viewingProperty.createdAt).toLocaleString()}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Property Images Gallery */}
            {viewingProperty.images && viewingProperty.images.length > 0 && (
              <div style={{ marginBottom: "25px" }}>
                <h5 style={{ marginBottom: "15px", fontSize: "18px", fontWeight: "700" }}>
                  <i className="fas fa-images" style={{ marginRight: "8px" }}></i>
                  Property Images ({viewingProperty.images.length})
                </h5>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "15px" }}>
                  {viewingProperty.images.map((image, index) => {
                    const imageUrl = `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${image}`;
                    return (
                      <div
                        key={index}
                        style={{
                          position: "relative",
                          paddingBottom: "75%",
                          backgroundColor: "#f3f4f6",
                          borderRadius: "8px",
                          overflow: "hidden",
                          border: "2px solid #e5e7eb",
                          cursor: "pointer"
                        }}
                        onClick={() => window.open(imageUrl, '_blank')}
                      >
                        <img
                          src={imageUrl}
                          alt={`Property ${index + 1}`}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover"
                          }}
                          onError={(e) => {
                            e.currentTarget.src = "/images/listings/list-1.jpg";
                          }}
                        />
                        <div style={{
                          position: "absolute",
                          bottom: "5px",
                          right: "5px",
                          backgroundColor: "rgba(0,0,0,0.7)",
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px"
                        }}>
                          {index + 1}
                        </div>
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
                            onClick={(e) => e.stopPropagation()}
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
            )}

            {/* Property Details in Two Columns */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px" }}>
              {/* Left Column */}
              <div>
                {/* Basic Information */}
                <div style={{ marginBottom: "20px" }}>
                  <h6 style={{ fontWeight: "700", marginBottom: "12px", fontSize: "16px", color: "#1f2937", borderBottom: "2px solid #e5e7eb", paddingBottom: "8px" }}>
                    Basic Information
                  </h6>
                  <p style={{ margin: "8px 0" }}><strong>Title:</strong> {viewingProperty.title}</p>
                  {viewingProperty.description && <p style={{ margin: "8px 0" }}><strong>Description:</strong> {viewingProperty.description}</p>}
                  <p style={{ margin: "8px 0" }}><strong>Category:</strong> {viewingProperty.propertyCategory || "N/A"}</p>
                  <p style={{ margin: "8px 0" }}><strong>Ad Type:</strong> {viewingProperty.propertyAdType || "N/A"}</p>
                  <p style={{ margin: "8px 0" }}>
                    <strong>Status:</strong>{" "}
                    <span className={`badge ${
                      viewingProperty.approvalStatus === "pending" ? "bg-warning" :
                      viewingProperty.approvalStatus === "approved" ? "bg-success" : "bg-danger"
                    }`}>
                      {viewingProperty.approvalStatus}
                    </span>
                  </p>
                </div>

                {/* Location */}
                <div style={{ marginBottom: "20px" }}>
                  <h6 style={{ fontWeight: "700", marginBottom: "12px", fontSize: "16px", color: "#1f2937", borderBottom: "2px solid #e5e7eb", paddingBottom: "8px" }}>
                    Location & Address
                  </h6>
                  <p style={{ margin: "8px 0" }}><strong>Country:</strong> {viewingProperty.country}</p>
                  <p style={{ margin: "8px 0" }}><strong>State:</strong> {viewingProperty.state}</p>
                  <p style={{ margin: "8px 0" }}><strong>City:</strong> {viewingProperty.city}</p>
                  {viewingProperty.locality && <p style={{ margin: "8px 0" }}><strong>Locality:</strong> {viewingProperty.locality}</p>}
                  {viewingProperty.street && <p style={{ margin: "8px 0" }}><strong>Street:</strong> {viewingProperty.street}</p>}
                  {viewingProperty.landmark && <p style={{ margin: "8px 0" }}><strong>Landmark:</strong> {viewingProperty.landmark}</p>}
                  {viewingProperty.address && <p style={{ margin: "8px 0" }}><strong>Full Address:</strong> {viewingProperty.address}</p>}
                  {viewingProperty.zipCode && <p style={{ margin: "8px 0" }}><strong>ZIP Code:</strong> {viewingProperty.zipCode}</p>}
                </div>

                {/* Pricing */}
                <div style={{ marginBottom: "20px" }}>
                  <h6 style={{ fontWeight: "700", marginBottom: "12px", fontSize: "16px", color: "#1f2937", borderBottom: "2px solid #e5e7eb", paddingBottom: "8px" }}>
                    Pricing & Ownership
                  </h6>
                  <p style={{ margin: "8px 0", fontSize: "20px", color: "#eb6753", fontWeight: "700" }}>
                    <strong>Price:</strong> {getCurrencySymbol(viewingProperty.country)} {viewingProperty.price?.toLocaleString() || "0"}
                  </p>
                  {viewingProperty.expectedPrice && <p style={{ margin: "8px 0" }}><strong>Expected Price:</strong> {getCurrencySymbol(viewingProperty.country)} {viewingProperty.expectedPrice?.toLocaleString()}</p>}
                  <p style={{ margin: "8px 0" }}><strong>Price Negotiable:</strong> {viewingProperty.priceNegotiable ? "Yes" : "No"}</p>
                  {viewingProperty.ownershipType && <p style={{ margin: "8px 0" }}><strong>Ownership Type:</strong> {viewingProperty.ownershipType}</p>}
                  {viewingProperty.availableFrom && <p style={{ margin: "8px 0" }}><strong>Available From:</strong> {new Date(viewingProperty.availableFrom).toLocaleDateString()}</p>}
                </div>
              </div>

              {/* Right Column */}
              <div>
                {/* Property Details */}
                <div style={{ marginBottom: "20px" }}>
                  <h6 style={{ fontWeight: "700", marginBottom: "12px", fontSize: "16px", color: "#1f2937", borderBottom: "2px solid #e5e7eb", paddingBottom: "8px" }}>
                    Property Details
                  </h6>
                  {viewingProperty.propertyType && <p style={{ margin: "8px 0" }}><strong>Property Type:</strong> {viewingProperty.propertyType}</p>}
                  {viewingProperty.buildingType && <p style={{ margin: "8px 0" }}><strong>Building Type:</strong> {viewingProperty.buildingType}</p>}
                  {viewingProperty.propertyAge && <p style={{ margin: "8px 0" }}><strong>Property Age:</strong> {viewingProperty.propertyAge}</p>}
                  {viewingProperty.furnishing && <p style={{ margin: "8px 0" }}><strong>Furnishing:</strong> {viewingProperty.furnishing}</p>}
                  <p style={{ margin: "8px 0" }}><strong>On Main Road:</strong> {viewingProperty.onMainRoad ? "Yes" : "No"}</p>
                  <p style={{ margin: "8px 0" }}><strong>Corner Property:</strong> {viewingProperty.cornerProperty ? "Yes" : "No"}</p>
                  {viewingProperty.floor && <p style={{ margin: "8px 0" }}><strong>Floor:</strong> {viewingProperty.floor}</p>}
                  {viewingProperty.totalFloor && <p style={{ margin: "8px 0" }}><strong>Total Floors:</strong> {viewingProperty.totalFloor}</p>}
                  {viewingProperty.superBuiltUpArea && <p style={{ margin: "8px 0" }}><strong>Super Built-Up Area:</strong> {viewingProperty.superBuiltUpArea} sq ft</p>}
                  {viewingProperty.carpetArea && <p style={{ margin: "8px 0" }}><strong>Carpet Area:</strong> {viewingProperty.carpetArea} sq ft</p>}
                  <p style={{ margin: "8px 0" }}><strong>Bedrooms:</strong> {viewingProperty.bedrooms || 0}</p>
                  <p style={{ margin: "8px 0" }}><strong>Bathrooms:</strong> {viewingProperty.bathrooms || 0}</p>
                  {viewingProperty.balconies && <p style={{ margin: "8px 0" }}><strong>Balconies:</strong> {viewingProperty.balconies}</p>}
                </div>

                {/* Amenities */}
                <div style={{ marginBottom: "20px" }}>
                  <h6 style={{ fontWeight: "700", marginBottom: "12px", fontSize: "16px", color: "#1f2937", borderBottom: "2px solid #e5e7eb", paddingBottom: "8px" }}>
                    Amenities
                  </h6>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {viewingProperty.powerBackup && <span className="badge bg-success">Power Backup</span>}
                    {viewingProperty.lift && <span className="badge bg-success">Lift</span>}
                    {viewingProperty.parking && <span className="badge bg-success">Parking ({viewingProperty.parking})</span>}
                    {viewingProperty.waterStorage && <span className="badge bg-success">Water Storage</span>}
                    {viewingProperty.security && <span className="badge bg-success">Security</span>}
                    {viewingProperty.gym && <span className="badge bg-success">Gym</span>}
                    {viewingProperty.swimmingPool && <span className="badge bg-success">Swimming Pool</span>}
                    {viewingProperty.garden && <span className="badge bg-success">Garden</span>}
                    {viewingProperty.clubHouse && <span className="badge bg-success">Club House</span>}
                    {viewingProperty.internetWifi && <span className="badge bg-success">Internet/WiFi</span>}
                  </div>
                </div>

                {/* Additional Information */}
                <div style={{ marginBottom: "20px" }}>
                  <h6 style={{ fontWeight: "700", marginBottom: "12px", fontSize: "16px", color: "#1f2937", borderBottom: "2px solid #e5e7eb", paddingBottom: "8px" }}>
                    Additional Information
                  </h6>
                  {viewingProperty.propertyDescription && <p style={{ margin: "8px 0" }}><strong>Description:</strong> {viewingProperty.propertyDescription}</p>}
                  {viewingProperty.previousOccupancy && <p style={{ margin: "8px 0" }}><strong>Previous Occupancy:</strong> {viewingProperty.previousOccupancy}</p>}
                  {viewingProperty.whoWillShow && <p style={{ margin: "8px 0" }}><strong>Who Will Show:</strong> {viewingProperty.whoWillShow}</p>}
                  {viewingProperty.secondaryNumber && <p style={{ margin: "8px 0" }}><strong>Alternate Contact:</strong> {viewingProperty.secondaryNumber}</p>}
                  <p style={{ margin: "8px 0" }}><strong>Painting Service:</strong> {viewingProperty.paintingService ? "Available" : "Not Available"}</p>
                  <p style={{ margin: "8px 0" }}><strong>Cleaning Service:</strong> {viewingProperty.cleaningService ? "Available" : "Not Available"}</p>
                </div>

                {/* Viewing Schedule */}
                <div style={{ marginBottom: "20px" }}>
                  <h6 style={{ fontWeight: "700", marginBottom: "12px", fontSize: "16px", color: "#1f2937", borderBottom: "2px solid #e5e7eb", paddingBottom: "8px" }}>
                    Viewing Schedule
                  </h6>
                  {viewingProperty.availabilityDays && <p style={{ margin: "8px 0" }}><strong>Availability Days:</strong> {viewingProperty.availabilityDays}</p>}
                  {viewingProperty.showingTime && <p style={{ margin: "8px 0" }}><strong>Showing Time:</strong> {viewingProperty.showingTime}</p>}
                  <p style={{ margin: "8px 0" }}><strong>WhatsApp Updates:</strong> {viewingProperty.whatsappUpdates ? "Yes" : "No"}</p>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div style={{ marginTop: "25px", paddingTop: "20px", borderTop: "2px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="btn btn-secondary"
              >
                Close
              </button>
              {viewingProperty.approvalStatus === "pending" && (
                <div>
                  <button
                    className="btn btn-success me-2"
                    onClick={() => {
                      handleApprove(viewingProperty._id);
                      setShowDetailsModal(false);
                    }}
                  >
                    ✓ Approve Property
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      setRejectingId(viewingProperty._id);
                      setShowDetailsModal(false);
                    }}
                  >
                    ✕ Reject Property
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyApprovalDashboard;
