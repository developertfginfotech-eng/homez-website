"use client";
import React, { useEffect, useState } from "react";
import {
  getPendingProperties,
  getPropertiesForApproval,
  approveProperty,
  rejectProperty,
} from "@/helpers/adminPropertyApi";

const PropertyApprovalDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filterStatus, setFilterStatus] = useState("pending");
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

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
                    <td>${property.price?.toLocaleString()}</td>
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
                      {property.approvalStatus === "pending" && (
                        <div className="btn-group" role="group">
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
    </div>
  );
};

export default PropertyApprovalDashboard;
