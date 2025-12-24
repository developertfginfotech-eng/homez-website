"use client";

import { useState, useEffect } from "react";
import { tourAPI } from "@/services/api";
import TourRequestModal from "./TourRequestModal";

const TourRequestsList = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTour, setSelectedTour] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [isBuyer, setIsBuyer] = useState(false);

  useEffect(() => {
    // Check if user is a buyer
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setIsBuyer(!userData.role || userData.role === 'buyer' || userData.role === 'user');
    }
    fetchTourRequests();
  }, []);

  const fetchTourRequests = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await tourAPI.getMyTours();
      if (response.data) {
        setTours(response.data);
      }
    } catch (err) {
      setError(err.message || "Failed to load tour requests");
      console.error("Error fetching tours:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (tour) => {
    setSelectedTour(tour);
    setShowModal(true);
  };

  const handleStatusUpdate = async () => {
    await fetchTourRequests();
    setShowModal(false);
    setSelectedTour(null);
  };

  const filteredTours = tours.filter((tour) => {
    if (filterStatus === "all") return true;
    return tour.status === filterStatus;
  });

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: "badge bg-warning",
      scheduled: "badge bg-info",
      completed: "badge bg-success",
      cancelled: "badge bg-danger",
    };
    return statusClasses[status] || "badge bg-secondary";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
      <div className="row mb20 align-items-center">
        <div className="col-lg-6">
          <h4 className="title fz17">Tour Requests ({filteredTours.length})</h4>
        </div>
        <div className="col-lg-6 text-end">
          <button
            className="ud-btn btn-thm-sm"
            onClick={fetchTourRequests}
            disabled={loading}
          >
            <i className="fal fa-sync me-2" />
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger mb20" role="alert">
          {error}
        </div>
      )}

      <div className="row mb20">
        <div className="col-lg-12">
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filterStatus === "all" ? "active" : ""}`}
              onClick={() => setFilterStatus("all")}
            >
              All ({tours.length})
            </button>
            <button
              className={`filter-btn ${filterStatus === "pending" ? "active" : ""}`}
              onClick={() => setFilterStatus("pending")}
            >
              Pending ({tours.filter((t) => t.status === "pending").length})
            </button>
            <button
              className={`filter-btn ${filterStatus === "scheduled" ? "active" : ""}`}
              onClick={() => setFilterStatus("scheduled")}
            >
              Scheduled ({tours.filter((t) => t.status === "scheduled").length})
            </button>
            <button
              className={`filter-btn ${filterStatus === "completed" ? "active" : ""}`}
              onClick={() => setFilterStatus("completed")}
            >
              Completed ({tours.filter((t) => t.status === "completed").length})
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : filteredTours.length === 0 ? (
        <div className="alert alert-info">
          {filterStatus === "all"
            ? isBuyer
              ? "No scheduled tours yet. Your tours will appear here once approved by the property owner."
              : "No tour requests yet"
            : `No ${filterStatus} ${isBuyer ? 'tours' : 'tour requests'}`}
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle text-nowrap table-hover table-centered mb-0">
            <thead className="bg-light-subtle">
              <tr>
                <th>Buyer Name</th>
                <th>Contact</th>
                <th>Tour Type</th>
                <th>Preferred Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTours.map((tour) => (
                <tr key={tour._id}>
                  <td>
                    <div className="fw-medium">{tour.name}</div>
                  </td>
                  <td>
                    <div className="text-muted small">
                      <div>{tour.email}</div>
                      <div>{tour.phone}</div>
                    </div>
                  </td>
                  <td>
                    <span className="badge bg-light text-dark">
                      {tour.tourType === "inperson" ? "In Person" : "Video Chat"}
                    </span>
                  </td>
                  <td>{formatDate(tour.preferredDate)}</td>
                  <td>{tour.time}</td>
                  <td>
                    <span className={getStatusBadge(tour.status)}>
                      {tour.status.charAt(0).toUpperCase() +
                        tour.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <button
                      className="ud-btn btn-white-sm"
                      onClick={() => handleViewDetails(tour)}
                    >
                      <i className="fal fa-eye me-1" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style jsx>{`
        .filter-btn {
          padding: 8px 16px;
          margin-right: 10px;
          margin-bottom: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .filter-btn:hover {
          border-color: #ff6b6b;
          color: #ff6b6b;
        }

        .filter-btn.active {
          background: #ff6b6b;
          color: white;
          border-color: #ff6b6b;
        }

        .badge {
          padding: 6px 12px;
          font-size: 12px;
          text-transform: capitalize;
        }

        .btn-white-sm {
          padding: 6px 12px;
          font-size: 12px;
          border: 1px solid #ddd;
          background: white;
          color: #333;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-white-sm:hover {
          border-color: #ff6b6b;
          color: #ff6b6b;
        }
      `}</style>

      {showModal && selectedTour && (
        <TourRequestModal
          tour={selectedTour}
          onClose={() => {
            setShowModal(false);
            setSelectedTour(null);
          }}
          onUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
};

export default TourRequestsList;
