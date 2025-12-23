"use client";

import { useState } from "react";
import { tourAPI } from "@/services/api";

const TourRequestModal = ({ tour, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notes, setNotes] = useState("");

  const handleStatusUpdate = async (newStatus) => {
    try {
      setLoading(true);
      setError("");

      await tourAPI.updateTourStatus(tour._id, newStatus);

      // Show success message
      alert(`Tour status updated to ${newStatus}`);
      onUpdate();
    } catch (err) {
      setError(err.message || "Failed to update tour status");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "#ff9800",
      scheduled: "#2196f3",
      completed: "#4caf50",
      cancelled: "#f44336",
    };
    return colors[status] || "#999";
  };

  return (
    <div className="tour-modal-overlay" onClick={onClose}>
      <div className="tour-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h5 className="modal-title">Tour Request Details</h5>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            aria-label="Close"
          ></button>
        </div>

        <div className="modal-body">
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="tour-details">
            <div className="row mb-3">
              <div className="col-md-6">
                <h6 className="text-muted mb-2">Buyer Information</h6>
                <p className="mb-1">
                  <strong>Name:</strong> {tour.name}
                </p>
                <p className="mb-1">
                  <strong>Email:</strong>{" "}
                  <a href={`mailto:${tour.email}`}>{tour.email}</a>
                </p>
                <p className="mb-0">
                  <strong>Phone:</strong>{" "}
                  <a href={`tel:${tour.phone}`}>{tour.phone}</a>
                </p>
              </div>
              <div className="col-md-6">
                <h6 className="text-muted mb-2">Tour Information</h6>
                <p className="mb-1">
                  <strong>Tour Type:</strong>{" "}
                  <span className="badge bg-light text-dark">
                    {tour.tourType === "inperson" ? "In Person" : "Video Chat"}
                  </span>
                </p>
                <p className="mb-1">
                  <strong>Preferred Date:</strong> {formatDate(tour.preferredDate)}
                </p>
                <p className="mb-0">
                  <strong>Time:</strong> {tour.time}
                </p>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <h6 className="text-muted mb-2">Current Status</h6>
                <span
                  className="badge"
                  style={{ backgroundColor: getStatusColor(tour.status) }}
                >
                  {tour.status.charAt(0).toUpperCase() + tour.status.slice(1)}
                </span>
              </div>
              <div className="col-md-6">
                <h6 className="text-muted mb-2">Submitted On</h6>
                <p className="mb-0">{formatDate(tour.createdAt)}</p>
              </div>
            </div>

            {tour.message && (
              <div className="row mb-3">
                <div className="col-12">
                  <h6 className="text-muted mb-2">Buyer's Message</h6>
                  <p className="border-left p-3 bg-light">
                    {tour.message}
                  </p>
                </div>
              </div>
            )}

            {tour.notes && (
              <div className="row mb-3">
                <div className="col-12">
                  <h6 className="text-muted mb-2">Your Notes</h6>
                  <p className="border-left p-3 bg-light text-info">
                    {tour.notes}
                  </p>
                </div>
              </div>
            )}

            <div className="row">
              <div className="col-12">
                <h6 className="text-muted mb-2">Add Notes (Optional)</h6>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Add notes about this tour request..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={loading}
                ></textarea>
              </div>
            </div>
          </div>

          <div className="modal-footer" style={{ borderTop: "1px solid #eee" }}>
            <div className="action-buttons">
              {tour.status === "pending" && (
                <>
                  <button
                    className="btn btn-success"
                    onClick={() => handleStatusUpdate("scheduled")}
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Schedule Tour"}
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleStatusUpdate("cancelled")}
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Reject"}
                  </button>
                </>
              )}

              {tour.status === "scheduled" && (
                <>
                  <button
                    className="btn btn-info"
                    onClick={() => handleStatusUpdate("completed")}
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Mark Completed"}
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleStatusUpdate("cancelled")}
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Cancel"}
                  </button>
                </>
              )}

              {(tour.status === "completed" || tour.status === "cancelled") && (
                <p className="text-muted mb-0">
                  This tour is {tour.status}. You can view the details but cannot modify it.
                </p>
              )}

              <button
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .tour-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .tour-modal {
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          max-width: 600px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px;
          border-bottom: 1px solid #eee;
        }

        .modal-title {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
        }

        .btn-close {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #999;
        }

        .btn-close:hover {
          color: #333;
        }

        .modal-body {
          padding: 24px;
        }

        .tour-details h6 {
          margin-bottom: 12px;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .tour-details p {
          margin-bottom: 8px;
          font-size: 14px;
        }

        .tour-details a {
          color: #ff6b6b;
          text-decoration: none;
        }

        .tour-details a:hover {
          text-decoration: underline;
        }

        .border-left {
          border-left: 4px solid #ff6b6b !important;
        }

        .modal-footer {
          padding: 24px;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .action-buttons {
          display: flex;
          gap: 10px;
          align-items: center;
          width: 100%;
          flex-wrap: wrap;
        }

        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .btn-success {
          background: #4caf50;
          color: white;
        }

        .btn-success:hover:not(:disabled) {
          background: #45a049;
        }

        .btn-danger {
          background: #f44336;
          color: white;
        }

        .btn-danger:hover:not(:disabled) {
          background: #da190b;
        }

        .btn-info {
          background: #2196f3;
          color: white;
        }

        .btn-info:hover:not(:disabled) {
          background: #0b7dda;
        }

        .btn-secondary {
          background: #ddd;
          color: #333;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #ccc;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .form-control {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          font-family: inherit;
        }

        .form-control:focus {
          outline: none;
          border-color: #ff6b6b;
          box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
        }

        .badge {
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }

        .alert {
          padding: 12px 16px;
          border-radius: 4px;
          margin-bottom: 16px;
          font-size: 14px;
        }

        .alert-danger {
          background: #ffebee;
          color: #c62828;
          border-left: 4px solid #f44336;
        }

        @media (max-width: 576px) {
          .tour-modal {
            width: 95%;
            max-height: 95vh;
          }

          .action-buttons {
            flex-direction: column;
          }

          .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default TourRequestModal;
