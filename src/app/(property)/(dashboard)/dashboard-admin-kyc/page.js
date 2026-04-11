"use client";

import DashboardHeader from "@/components/common/DashboardHeader";
import MobileMenu from "@/components/common/mobile-menu";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import Footer from "@/components/property/dashboard/Footer";
import SidebarDashboard from "@/components/property/dashboard/SidebarDashboard";
import { kycAPI } from "@/services/api";
import { useState, useEffect } from "react";

const AdminKYCVerification = () => {
  const [kycSubmissions, setKycSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending"); // pending, verified, rejected, all
  const [selectedKYC, setSelectedKYC] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchKYCSubmissions();
  }, [filter]);

  const fetchKYCSubmissions = async () => {
    setLoading(true);
    try {
      // Fetch real data from backend API
      const response = await kycAPI.getAllKYCSubmissions(filter);

      if (response.success && response.submissions) {
        setKycSubmissions(response.submissions);
      } else {
        setKycSubmissions([]);
      }
    } catch (error) {
      console.error("❌ Error fetching KYC submissions:", error);
      setKycSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (kycId) => {
    if (!confirm("Are you sure you want to approve this KYC verification?")) return;

    try {
      const response = await kycAPI.verifyKYC(kycId, "verified");

      if (response.success) {
        alert("✅ KYC approved successfully!");
        fetchKYCSubmissions();
      } else {
        alert("❌ Failed to approve KYC: " + (response.message || "Unknown error"));
      }
    } catch (error) {
      console.error("❌ Error approving KYC:", error);
      alert("Failed to approve KYC: " + error.message);
    }
  };

  const handleReject = async (kycId) => {
    const reason = prompt("Please enter rejection reason:");
    if (!reason) return;

    try {
      const response = await kycAPI.verifyKYC(kycId, "rejected", reason);

      if (response.success) {
        alert("✅ KYC rejected. User will be notified.");
        fetchKYCSubmissions();
      } else {
        alert("❌ Failed to reject KYC: " + (response.message || "Unknown error"));
      }
    } catch (error) {
      console.error("❌ Error rejecting KYC:", error);
      alert("Failed to reject KYC: " + error.message);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: { bg: "#fef3c7", color: "#92400e", text: "Pending Review" },
      verified: { bg: "#d1fae5", color: "#065f46", text: "Verified" },
      rejected: { bg: "#fee2e2", color: "#991b1b", text: "Rejected" },
    };
    const style = styles[status] || styles.pending;

    return (
      <span
        style={{
          backgroundColor: style.bg,
          color: style.color,
          padding: "4px 12px",
          borderRadius: "12px",
          fontSize: "12px",
          fontWeight: "600",
        }}
      >
        {style.text}
      </span>
    );
  };

  const getCountryDocuments = (country) => {
    const docs = {
      India: ["Aadhaar Card", "PAN Card"],
      USA: ["Driver's License", "SSN"],
      UK: ["Passport", "National Insurance Number"],
      Canada: ["Driver's License", "SIN"],
      Australia: ["Driver's License", "TFN"],
    };
    return docs[country] || [];
  };

  return (
    <>
      <DashboardHeader />
      <MobileMenu />

      <div className="dashboard_content_wrapper">
        <div className="dashboard dashboard_wrapper pr30 pr0-md">
          <SidebarDashboard />

          <div className="dashboard__main pl0-md">
            <div className="dashboard__content property-page bgc-f7">
              <div className="row pb40 d-block d-lg-none">
                <div className="col-lg-12">
                  <DboardMobileNavigation />
                </div>
              </div>

              <div className="row align-items-center pb30">
                <div className="col-lg-8">
                  <div className="dashboard_title_area">
                    <h2>KYC Verification Management</h2>
                    <p className="text">Review and verify user KYC documents</p>
                  </div>
                </div>
                <div className="col-lg-4 text-end">
                  <div className="d-flex gap-2 justify-content-end">
                    <button
                      onClick={() => setFilter("pending")}
                      className={`btn btn-sm ${filter === "pending" ? "btn-thm" : "btn-outline-secondary"}`}
                      style={{
                        backgroundColor: filter === "pending" ? "#eb6753" : "white",
                        color: filter === "pending" ? "white" : "#6b7280",
                        border: "1px solid #e5e7eb",
                        padding: "8px 16px",
                        fontSize: "14px",
                        fontWeight: "600",
                        borderRadius: "6px",
                      }}
                    >
                      Pending ({kycSubmissions.filter(k => k.status === "pending").length})
                    </button>
                    <button
                      onClick={() => setFilter("all")}
                      className={`btn btn-sm ${filter === "all" ? "btn-thm" : "btn-outline-secondary"}`}
                      style={{
                        backgroundColor: filter === "all" ? "#eb6753" : "white",
                        color: filter === "all" ? "white" : "#6b7280",
                        border: "1px solid #e5e7eb",
                        padding: "8px 16px",
                        fontSize: "14px",
                        fontWeight: "600",
                        borderRadius: "6px",
                      }}
                    >
                      All
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
              ) : kycSubmissions.length === 0 ? (
                <div className="row">
                  <div className="col-lg-12">
                    <div className="bgc-white p50 text-center bdrs12">
                      <i className="fas fa-clipboard-check" style={{ fontSize: "64px", color: "#d1d5db", marginBottom: "20px" }}></i>
                      <h4 style={{ color: "#6b7280", marginBottom: "10px" }}>No KYC Submissions</h4>
                      <p className="text-muted">There are no {filter} KYC verifications at the moment.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="row">
                  {kycSubmissions.map((kyc) => (
                    <div className="col-lg-12 mb-3" key={kyc.id}>
                      <div
                        className="bgc-white p30 bdrs12"
                        style={{
                          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                          border: kyc.status === "pending" ? "2px solid #fbbf24" : "1px solid #e5e7eb",
                        }}
                      >
                        <div className="row align-items-center">
                          {/* User Info */}
                          <div className="col-lg-4 mb-3 mb-lg-0">
                            <div className="d-flex align-items-start">
                              <div
                                className="avatar-wrapper me-3"
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  backgroundColor: "#eb6753",
                                  borderRadius: "12px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  flexShrink: 0,
                                }}
                              >
                                <span style={{ fontSize: "24px", fontWeight: "700", color: "white" }}>
                                  {kyc.userName.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <h5 className="mb-1" style={{ fontSize: "16px", fontWeight: "700" }}>
                                  {kyc.userName}
                                </h5>
                                <p className="mb-1" style={{ fontSize: "13px", color: "#6b7280" }}>
                                  <i className="fas fa-envelope me-2"></i>
                                  {kyc.email}
                                </p>
                                <p className="mb-1" style={{ fontSize: "13px", color: "#6b7280" }}>
                                  <i className="fas fa-phone me-2"></i>
                                  {kyc.phone}
                                </p>
                                <div className="mt-2">
                                  <span
                                    style={{
                                      backgroundColor: "#f3f4f6",
                                      color: "#374151",
                                      padding: "4px 10px",
                                      borderRadius: "6px",
                                      fontSize: "12px",
                                      fontWeight: "600",
                                      marginRight: "8px",
                                    }}
                                  >
                                    {kyc.role}
                                  </span>
                                  <span
                                    style={{
                                      backgroundColor: "#f3f4f6",
                                      color: "#374151",
                                      padding: "4px 10px",
                                      borderRadius: "6px",
                                      fontSize: "12px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    {kyc.country}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Documents */}
                          <div className="col-lg-4 mb-3 mb-lg-0">
                            <h6 className="mb-2" style={{ fontSize: "14px", fontWeight: "700", color: "#374151" }}>
                              Submitted Documents:
                            </h6>
                            <div className="documents-list">
                              {Object.entries(kyc.documents).map(([key, value]) => {
                                if (!value) return null;
                                return (
                                  <div key={key} className="d-flex align-items-center justify-content-between mb-2">
                                    <div className="d-flex align-items-center">
                                      <i className="fas fa-file-pdf text-danger me-2"></i>
                                      <a
                                        href={value}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                          fontSize: "13px",
                                          color: "#eb6753",
                                          textDecoration: "none",
                                          fontWeight: "500",
                                        }}
                                      >
                                        {key.replace(/([A-Z])/g, " $1").trim()}
                                      </a>
                                    </div>
                                    <a
                                      href={value}
                                      download
                                      style={{
                                        fontSize: "12px",
                                        color: "#6b7280",
                                        textDecoration: "none",
                                        padding: "4px 8px",
                                        backgroundColor: "#f3f4f6",
                                        borderRadius: "4px",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "4px",
                                      }}
                                      title="Download document"
                                    >
                                      <i className="fas fa-download"></i>
                                    </a>
                                  </div>
                                );
                              })}
                            </div>
                            <p className="mt-2 mb-0" style={{ fontSize: "12px", color: "#9ca3af" }}>
                              Submitted: {new Date(kyc.submittedAt).toLocaleString()}
                            </p>
                          </div>

                          {/* Status & Actions */}
                          <div className="col-lg-4 text-lg-end">
                            <div className="mb-3">{getStatusBadge(kyc.status)}</div>

                            {/* View Details Button */}
                            <div className="mb-3">
                              <button
                                onClick={() => {
                                  setSelectedKYC(kyc);
                                  setShowDetailsModal(true);
                                }}
                                className="btn btn-sm w-100"
                                style={{
                                  backgroundColor: "#3b82f6",
                                  color: "white",
                                  padding: "8px 20px",
                                  fontSize: "14px",
                                  fontWeight: "600",
                                  border: "none",
                                  borderRadius: "6px",
                                }}
                              >
                                <i className="fas fa-eye me-2"></i>
                                View Details
                              </button>
                            </div>

                            {kyc.status === "pending" && (
                              <div className="d-flex gap-2 justify-content-lg-end">
                                <button
                                  onClick={() => handleApprove(kyc.id)}
                                  className="btn btn-sm"
                                  style={{
                                    backgroundColor: "#10b981",
                                    color: "white",
                                    padding: "8px 20px",
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    border: "none",
                                    borderRadius: "6px",
                                  }}
                                >
                                  <i className="fas fa-check me-2"></i>
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleReject(kyc.id)}
                                  className="btn btn-sm"
                                  style={{
                                    backgroundColor: "#ef4444",
                                    color: "white",
                                    padding: "8px 20px",
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    border: "none",
                                    borderRadius: "6px",
                                  }}
                                >
                                  <i className="fas fa-times me-2"></i>
                                  Reject
                                </button>
                              </div>
                            )}
                            {kyc.status === "verified" && kyc.verifiedAt && (
                              <p className="mt-2 mb-0" style={{ fontSize: "12px", color: "#059669" }}>
                                <i className="fas fa-check-circle me-2"></i>
                                Verified: {new Date(kyc.verifiedAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Footer />
          </div>
        </div>
      </div>

      {/* KYC Details Modal */}
      {showDetailsModal && selectedKYC && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 99999,
            padding: "20px",
          }}
          onClick={() => setShowDetailsModal(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              maxWidth: "900px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "0",
              boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{
              padding: "25px 30px",
              borderBottom: "2px solid #e5e7eb",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              position: "sticky",
              top: 0,
              backgroundColor: "white",
              zIndex: 1,
            }}>
              <h3 style={{ margin: 0, fontSize: "24px", fontWeight: "700", color: "#1f2937" }}>
                <i className="fas fa-file-alt me-2" style={{ color: "#3b82f6" }}></i>
                KYC Details - {selectedKYC.userName}
              </h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "32px",
                  cursor: "pointer",
                  color: "#9ca3af",
                  lineHeight: "1",
                  padding: "0",
                  width: "32px",
                  height: "32px",
                }}
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: "30px" }}>
              {/* User Account Information */}
              <div style={{ marginBottom: "30px", padding: "20px", backgroundColor: "#f0f9ff", borderRadius: "8px", border: "1px solid #bae6fd" }}>
                <h5 style={{ marginBottom: "15px", fontSize: "18px", fontWeight: "700", color: "#0c4a6e" }}>
                  <i className="fas fa-user me-2"></i>
                  User Account Information
                </h5>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                  <div>
                    <p style={{ margin: "8px 0" }}><strong>Account Name:</strong> {selectedKYC.userName}</p>
                    <p style={{ margin: "8px 0" }}><strong>Account Email:</strong> {selectedKYC.email}</p>
                    {selectedKYC.phone && <p style={{ margin: "8px 0" }}><strong>Account Phone:</strong> {selectedKYC.phone}</p>}
                  </div>
                  <div>
                    <p style={{ margin: "8px 0" }}><strong>Country:</strong> {selectedKYC.country}</p>
                    <p style={{ margin: "8px 0" }}>
                      <strong>Account Type:</strong>
                      <span style={{
                        marginLeft: "8px",
                        padding: "4px 10px",
                        backgroundColor: "#e0f2fe",
                        color: "#075985",
                        borderRadius: "6px",
                        fontSize: "13px",
                        fontWeight: "600",
                      }}>
                        {selectedKYC.accountType || selectedKYC.role}
                      </span>
                    </p>
                    <p style={{ margin: "8px 0" }}>
                      <strong>Status:</strong> {getStatusBadge(selectedKYC.status)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Company Information (only if exists) */}
              {selectedKYC.companyInfo && Object.values(selectedKYC.companyInfo).some(val => val) && (
                <div style={{ marginBottom: "30px", padding: "20px", backgroundColor: "#fef3c7", borderRadius: "8px", border: "1px solid #fde68a" }}>
                  <h5 style={{ marginBottom: "15px", fontSize: "18px", fontWeight: "700", color: "#78350f" }}>
                    <i className="fas fa-building me-2"></i>
                    Company Information
                  </h5>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                    {selectedKYC.companyInfo.companyName && (
                      <p style={{ margin: "8px 0" }}><strong>Company Name:</strong> {selectedKYC.companyInfo.companyName}</p>
                    )}
                    {selectedKYC.companyInfo.registrationNumber && (
                      <p style={{ margin: "8px 0" }}><strong>Registration Number:</strong> {selectedKYC.companyInfo.registrationNumber}</p>
                    )}
                    {selectedKYC.companyInfo.companyEmail && (
                      <p style={{ margin: "8px 0" }}><strong>Company Email:</strong> {selectedKYC.companyInfo.companyEmail}</p>
                    )}
                    {selectedKYC.companyInfo.companyPhone && (
                      <p style={{ margin: "8px 0" }}><strong>Company Phone:</strong> {selectedKYC.companyInfo.companyPhone}</p>
                    )}
                    {selectedKYC.companyInfo.companyAddress && (
                      <p style={{ margin: "8px 0", gridColumn: "1 / -1" }}>
                        <strong>Company Address:</strong> {[
                          selectedKYC.companyInfo.companyAddress.line1,
                          selectedKYC.companyInfo.companyAddress.line2,
                          selectedKYC.companyInfo.companyAddress.city,
                          selectedKYC.companyInfo.companyAddress.state,
                          selectedKYC.companyInfo.companyAddress.zipCode
                        ].filter(Boolean).join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Authorized Signatory Details (only if exists) */}
              {selectedKYC.authorizedSignatory && Object.values(selectedKYC.authorizedSignatory).some(val => val) && (
                <div style={{ marginBottom: "30px", padding: "20px", backgroundColor: "#f3e8ff", borderRadius: "8px", border: "1px solid #e9d5ff" }}>
                  <h5 style={{ marginBottom: "15px", fontSize: "18px", fontWeight: "700", color: "#6b21a8" }}>
                    <i className="fas fa-user-tie me-2"></i>
                    Authorized Signatory Details
                  </h5>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                    {selectedKYC.authorizedSignatory.fullName && (
                      <p style={{ margin: "8px 0" }}><strong>Full Name:</strong> {selectedKYC.authorizedSignatory.fullName}</p>
                    )}
                    {selectedKYC.authorizedSignatory.designation && (
                      <p style={{ margin: "8px 0" }}><strong>Designation:</strong> {selectedKYC.authorizedSignatory.designation}</p>
                    )}
                    {selectedKYC.authorizedSignatory.authorizationBasis && (
                      <p style={{ margin: "8px 0" }}><strong>Authorization Basis:</strong> {selectedKYC.authorizedSignatory.authorizationBasis}</p>
                    )}
                    {selectedKYC.authorizedSignatory.reraLicenseNumber && (
                      <p style={{ margin: "8px 0" }}><strong>RERA License Number:</strong> {selectedKYC.authorizedSignatory.reraLicenseNumber}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Uploaded Documents */}
              {selectedKYC.documents && Object.keys(selectedKYC.documents).length > 0 && (
                <div style={{ marginBottom: "30px", padding: "20px", backgroundColor: "#dcfce7", borderRadius: "8px", border: "1px solid #bbf7d0" }}>
                  <h5 style={{ marginBottom: "15px", fontSize: "18px", fontWeight: "700", color: "#14532d" }}>
                    <i className="fas fa-file-upload me-2"></i>
                    Uploaded Documents
                  </h5>
                  <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    {Object.entries(selectedKYC.documents).map(([key, value]) => {
                      if (!value) return null;

                      // Check if this is a front/back document
                      if (value.hasFrontBack) {
                        return (
                          <div key={key} style={{ padding: "15px", backgroundColor: "white", borderRadius: "8px", border: "1px solid #d1fae5" }}>
                            <p style={{ margin: "0 0 10px 0", fontWeight: "600", color: "#1f2937", fontSize: "15px" }}>
                              <i className="fas fa-file-pdf text-danger me-2"></i>
                              {value.documentName || key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                            </p>
                            {selectedKYC.submittedAt && (
                              <p style={{ margin: "0 0 15px 0", fontSize: "12px", color: "#6b7280" }}>
                                Uploaded: {new Date(selectedKYC.submittedAt).toLocaleString()}
                              </p>
                            )}
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                              {value.front && (
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", backgroundColor: "#f9fafb", borderRadius: "6px" }}>
                                  <span style={{ fontWeight: "500", color: "#374151" }}>Front Side</span>
                                  <div style={{ display: "flex", gap: "8px" }}>
                                    <a
                                      href={value.front}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{ padding: "6px 12px", backgroundColor: "#3b82f6", color: "white", textDecoration: "none", borderRadius: "4px", fontSize: "13px", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "4px" }}
                                    >
                                      <i className="fas fa-eye"></i>
                                      View
                                    </a>
                                    <a
                                      href={value.front}
                                      download
                                      style={{ padding: "6px 12px", backgroundColor: "#10b981", color: "white", textDecoration: "none", borderRadius: "4px", fontSize: "13px", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "4px" }}
                                    >
                                      <i className="fas fa-download"></i>
                                      Download
                                    </a>
                                  </div>
                                </div>
                              )}
                              {value.back && (
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", backgroundColor: "#f9fafb", borderRadius: "6px" }}>
                                  <span style={{ fontWeight: "500", color: "#374151" }}>Back Side</span>
                                  <div style={{ display: "flex", gap: "8px" }}>
                                    <a
                                      href={value.back}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{ padding: "6px 12px", backgroundColor: "#3b82f6", color: "white", textDecoration: "none", borderRadius: "4px", fontSize: "13px", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "4px" }}
                                    >
                                      <i className="fas fa-eye"></i>
                                      View
                                    </a>
                                    <a
                                      href={value.back}
                                      download
                                      style={{ padding: "6px 12px", backgroundColor: "#10b981", color: "white", textDecoration: "none", borderRadius: "4px", fontSize: "13px", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "4px" }}
                                    >
                                      <i className="fas fa-download"></i>
                                      Download
                                    </a>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      }

                      // Regular document (single or multiple files)
                      const files = Array.isArray(value.files) ? value.files : (value.files ? [value.files] : [value]);
                      return (
                        <div key={key} style={{ padding: "15px", backgroundColor: "white", borderRadius: "8px", border: "1px solid #d1fae5" }}>
                          <p style={{ margin: "0 0 10px 0", fontWeight: "600", color: "#1f2937", fontSize: "15px" }}>
                            <i className="fas fa-file-pdf text-danger me-2"></i>
                            {value.documentName || key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                          </p>
                          {selectedKYC.submittedAt && (
                            <p style={{ margin: "0 0 15px 0", fontSize: "12px", color: "#6b7280" }}>
                              Uploaded: {new Date(selectedKYC.submittedAt).toLocaleString()}
                            </p>
                          )}
                          {files.map((file, idx) => (
                            <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: files.length > 1 ? "8px" : "0" }}>
                              {files.length > 1 && <span style={{ fontWeight: "500", color: "#6b7280", fontSize: "13px" }}>File {idx + 1}</span>}
                              <div style={{ display: "flex", gap: "10px", marginLeft: "auto" }}>
                                <a
                                  href={file}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ padding: "8px 16px", backgroundColor: "#3b82f6", color: "white", textDecoration: "none", borderRadius: "6px", fontSize: "14px", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "6px" }}
                                >
                                  <i className="fas fa-eye"></i>
                                  View
                                </a>
                                <a
                                  href={file}
                                  download
                                  style={{ padding: "8px 16px", backgroundColor: "#10b981", color: "white", textDecoration: "none", borderRadius: "6px", fontSize: "14px", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "6px" }}
                                >
                                  <i className="fas fa-download"></i>
                                  Download
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Additional Information */}
              {(selectedKYC.notes || selectedKYC.rejectionReason) && (
                <div style={{ marginBottom: "20px", padding: "20px", backgroundColor: "#fee2e2", borderRadius: "8px", border: "1px solid #fecaca" }}>
                  <h5 style={{ marginBottom: "15px", fontSize: "18px", fontWeight: "700", color: "#991b1b" }}>
                    <i className="fas fa-info-circle me-2"></i>
                    Additional Information
                  </h5>
                  {selectedKYC.notes && (
                    <p style={{ margin: "8px 0" }}><strong>Notes:</strong> {selectedKYC.notes}</p>
                  )}
                  {selectedKYC.rejectionReason && (
                    <p style={{ margin: "8px 0" }}><strong>Rejection Reason:</strong> {selectedKYC.rejectionReason}</p>
                  )}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div style={{
              padding: "20px 30px",
              borderTop: "2px solid #e5e7eb",
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              position: "sticky",
              bottom: 0,
              backgroundColor: "white",
            }}>
              {selectedKYC.status === "pending" && (
                <>
                  <button
                    onClick={() => {
                      handleApprove(selectedKYC.id);
                      setShowDetailsModal(false);
                    }}
                    style={{
                      padding: "10px 24px",
                      backgroundColor: "#10b981",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "15px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    <i className="fas fa-check me-2"></i>
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      handleReject(selectedKYC.id);
                      setShowDetailsModal(false);
                    }}
                    style={{
                      padding: "10px 24px",
                      backgroundColor: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "15px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    <i className="fas fa-times me-2"></i>
                    Reject
                  </button>
                </>
              )}
              <button
                onClick={() => setShowDetailsModal(false)}
                style={{
                  padding: "10px 24px",
                  backgroundColor: "#6b7280",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminKYCVerification;
