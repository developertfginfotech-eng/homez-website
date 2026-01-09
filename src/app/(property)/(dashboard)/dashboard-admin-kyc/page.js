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
                                  <div key={key} className="d-flex align-items-center mb-2">
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
    </>
  );
};

export default AdminKYCVerification;
