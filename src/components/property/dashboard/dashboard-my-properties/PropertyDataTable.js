"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { getPropertiesByAgent } from "@/helpers/propertyApi";

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
                    src={property.imagesText || "/images/listings/list-1.jpg"}
                    alt={property.title}
                    onError={(e) => {
                      e.currentTarget.src = "/images/listings/list-1.jpg";
                    }}
                  />
                </div>
                <div className="list-content py-0 p-0 mt-2 mt-xxl-0 ps-xxl-4">
                  <div className="h6 list-title">
                    <Link href={`/single-v1/${property._id}`}>{property.title}</Link>
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
              <span className={getStatusStyle(property.propertyStatus)}>
                {property.propertyStatus || "Pending"}
              </span>
            </td>
            <td className="vam">${property.price?.toLocaleString() || "0"}</td>
            <td className="vam">
              <div className="d-flex">
                <button
                  className="icon"
                  style={{ border: "none" }}
                  data-tooltip-id={`edit-${property._id}`}
                >
                  <span className="fas fa-pen fa" />
                </button>
                <button
                  className="icon"
                  style={{ border: "none" }}
                  data-tooltip-id={`delete-${property._id}`}
                >
                  <span className="flaticon-bin" />
                </button>

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
  );
};

export default PropertyDataTable;
