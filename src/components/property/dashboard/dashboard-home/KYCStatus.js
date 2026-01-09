"use client";

import React, { useState, useEffect } from "react";
import { kycAPI } from "@/services/api";
import Link from "next/link";

const KYCStatus = () => {
  const [kycData, setKycData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchKYCStatus = async () => {
      try {
        setLoading(true);

        // First check localStorage for KYC status
        const kycStatus = localStorage.getItem("kycStatus");
        const kycVerified = localStorage.getItem("kycVerified");
        const kycSubmitted = localStorage.getItem("kycSubmitted");
        const userStr = localStorage.getItem("user");
        let user = userStr ? JSON.parse(userStr) : null;

        // Fix for existing users with old data structure
        // If user has kycVerified true but no explicit verified status, treat as pending
        if (user && user.kycVerified === true && !user.kycStatus) {
          // This is old data - convert to pending status for admin verification
          user.kycVerified = false;
          user.kycStatus = "pending";
          user.kycSubmitted = true;
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("kycStatus", "pending");
          localStorage.setItem("kycSubmitted", "true");
          localStorage.removeItem("kycVerified");
        }

        // IMPORTANT: Check pending status FIRST before verified status
        // This ensures that recently submitted KYC shows as pending even if old verified flag exists
        if (kycStatus === "pending" || kycSubmitted === "true" || (user && user.kycStatus === "pending")) {
          setKycData({
            status: "pending",
            createdAt: new Date().toISOString(),
          });
          setLoading(false);
          return;
        }

        // Check if KYC is verified (only if not pending)
        if ((kycVerified === "true" || (user && user.kycVerified)) && kycStatus !== "pending") {
          setKycData({
            status: "verified",
            createdAt: new Date().toISOString(),
          });
          setLoading(false);
          return;
        }

        // Check if KYC is rejected
        if (kycStatus === "rejected" || (user && user.kycStatus === "rejected")) {
          setKycData({
            status: "rejected",
            createdAt: new Date().toISOString(),
            rejectionReason: user?.kycRejectionReason || "Please check your documents and resubmit",
          });
          setLoading(false);
          return;
        }

        // If not in localStorage, try API call
        const response = await kycAPI.getKYCStatus();

        if (response.success && response.kyc) {
          setKycData(response.kyc);
        }
      } catch (err) {
        // User hasn't submitted KYC yet
        console.log("No KYC submission found");
      } finally {
        setLoading(false);
      }
    };

    fetchKYCStatus();
  }, []);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        class: "pending-style style1",
        bgColor: "#FFA500",
        text: "Pending Review",
        icon: "flaticon-clock",
      },
      verified: {
        class: "pending-style style2",
        bgColor: "#28a745",
        text: "Verified",
        icon: "flaticon-verified",
      },
      rejected: {
        class: "pending-style style3",
        bgColor: "#dc3545",
        text: "Rejected",
        icon: "flaticon-close",
      },
    };

    return statusConfig[status] || statusConfig.pending;
  };

  if (loading) {
    return (
      <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
        <div className="d-flex align-items-center">
          <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="text-muted">Loading KYC status...</span>
        </div>
      </div>
    );
  }

  if (error || !kycData) {
    return (
      <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h4 className="title fz17 mb10">KYC Verification</h4>
            <p className="text fz15 mb-0">
              Complete your KYC verification to access all features
            </p>
          </div>
          <Link
            href="/kyc-property-verification"
            className="ud-btn btn-thm"
            style={{ whiteSpace: "nowrap" }}
          >
            Verify Now
            <i className="fal fa-arrow-right-long ms-2" />
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusBadge(kycData.status);

  return (
    <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
      <div className="row align-items-center">
        <div className="col-md-8">
          <h4 className="title fz17 mb15">KYC Verification Status</h4>

          <div className="d-flex align-items-center mb15">
            <span
              className={`${statusInfo.class} text-white px-3 py-2 bdrs8 fz14 fw500`}
              style={{ backgroundColor: statusInfo.bgColor }}
            >
              {statusInfo.text}
            </span>
          </div>

          {kycData.status === "pending" && (
            <p className="text fz14 mb-0">
              <i className="flaticon-info-button text-primary me-2" />
              Your KYC documents are under review. We'll notify you once verified.
            </p>
          )}

          {kycData.status === "verified" && (
            <p className="text fz14 mb-0 text-success">
              <i className="flaticon-verified me-2" />
              Your identity has been verified successfully!
            </p>
          )}

          {kycData.status === "rejected" && (
            <div>
              <p className="text fz14 mb10 text-danger">
                <i className="flaticon-close me-2" />
                Your KYC verification was rejected.
              </p>
              {kycData.rejectionReason && (
                <div
                  className="alert alert-danger p-2 fz13 mb15"
                  style={{ fontSize: "13px" }}
                >
                  <strong>Reason:</strong> {kycData.rejectionReason}
                </div>
              )}
              <Link
                href="/kyc-property-verification"
                className="ud-btn btn-thm-border fz14"
              >
                Resubmit KYC
                <i className="fal fa-arrow-right-long ms-2" />
              </Link>
            </div>
          )}
        </div>

        <div className="col-md-4 text-center">
          <div
            className="icon-box d-inline-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: "80px",
              height: "80px",
              backgroundColor: statusInfo.bgColor + "20",
            }}
          >
            <i
              className={statusInfo.icon}
              style={{ fontSize: "32px", color: statusInfo.bgColor }}
            />
          </div>

          {kycData.createdAt && (
            <p className="text fz12 mt15 mb-0 text-muted">
              Submitted on{" "}
              {new Date(kycData.createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default KYCStatus;
