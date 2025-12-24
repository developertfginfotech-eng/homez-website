"use client";
import React, { useState, useEffect } from "react";
import PropertyDescription from "./property-description";
import UploadMedia from "./upload-media";
import LocationField from "./LocationField";
import DetailsFiled from "./details-field";
import Amenities from "./Amenities";
import { addProperty } from "@/helpers/propertyApi";
import { useRouter } from "next/navigation";
import { kycAPI } from "@/services/api";

const AddPropertyTabContent = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("nav-item1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [kycStatus, setKycStatus] = useState(null);
  const [checkingKyc, setCheckingKyc] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    // Check user role and KYC status
    const checkKycStatus = async () => {
      try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          setUserRole(user.role);

          // Only check KYC for sellers and brokers (not admin or buyer)
          if (user.role === "seller" || user.role === "broker") {
            const response = await kycAPI.getKYCStatus();
            setKycStatus(response.kyc?.status || "not_submitted");
          } else {
            // Admin and buyers don't need KYC
            setKycStatus("verified");
          }
        }
      } catch (err) {
        console.error("Error checking KYC status:", err);
        setKycStatus("not_submitted");
      } finally {
        setCheckingKyc(false);
      }
    };

    checkKycStatus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      // Get all form inputs
      const form = e.currentTarget;
      const inputs = form.querySelectorAll("input[name], textarea[name], select[name]");
      const data = {};

      inputs.forEach((input) => {
        if (input.name) {
          data[input.name] = input.value;
        }
      });

      // Get checked amenities
      const amenitiesCheckboxes = document.querySelectorAll('input[name="amenity"]:checked');
      const amenities = Array.from(amenitiesCheckboxes).map(cb => cb.value);

      // Create FormData for file upload
      const formData = new FormData();

      // Append all property data fields
      formData.append('title', data.title || "");
      formData.append('description', data.description || "");
      formData.append('category', data.category || "");
      formData.append('listedIn', data.listedIn || "Active");
      formData.append('propertyType', data.propertyType || "Rent");
      formData.append('propertyStatus', data.propertyStatus || "Published");
      formData.append('price', parseFloat(data.price) || 0);
      formData.append('yearlyTaxRate', parseFloat(data.yearlyTaxRate) || 0);
      formData.append('afterPriceLabel', data.afterPriceLabel || "");
      formData.append('videoUrl', data.videoUrl || "");
      formData.append('videoOption', data.videoOption || "youtube");
      formData.append('virtualTour', data.virtualTour || "");
      formData.append('address', data.address || "");
      formData.append('countryState', data.countryState || "");
      formData.append('city', data.city || "");
      formData.append('country', data.country || "");
      formData.append('zipCode', data.zipCode || "");
      formData.append('neighborhood', data.neighborhood || "");
      formData.append('latitude', parseFloat(data.latitude) || 0);
      formData.append('longitude', parseFloat(data.longitude) || 0);
      formData.append('sizeInFt', parseFloat(data.sizeInFt) || 0);
      formData.append('lotSizeInFt', parseFloat(data.lotSizeInFt) || 0);
      formData.append('rooms', parseInt(data.rooms) || 0);
      formData.append('bedrooms', parseInt(data.bedrooms) || 0);
      formData.append('bathrooms', parseInt(data.bathrooms) || 0);
      formData.append('customId', data.customId || "");
      formData.append('garages', parseInt(data.garages) || 0);
      formData.append('garageSize', parseFloat(data.garageSize) || 0);
      formData.append('yearBuilt', parseInt(data.yearBuilt) || 0);
      formData.append('availableFrom', data.availableFrom || "");
      formData.append('basement', data.basement || "");
      formData.append('extraDetails', data.extraDetails || "");
      formData.append('roofing', data.roofing || "");
      formData.append('exteriorMaterial', data.exteriorMaterial || "");
      formData.append('structureType', data.structureType || "");
      formData.append('floorsNo', parseInt(data.floorsNo) || 0);
      formData.append('energyClass', data.energyClass || "");
      formData.append('energyIndex', parseFloat(data.energyIndex) || 0);
      formData.append('ownerAgentNotes', data.ownerAgentNotes || "");

      // Append amenities as JSON string (for multipart/form-data compatibility)
      formData.append('amenities', JSON.stringify(amenities));

      // Append image files
      console.log("📤 Uploading files:", uploadedFiles);
      uploadedFiles.forEach((file, index) => {
        console.log(`  File ${index + 1}:`, file.name, file.type, file.size, "bytes");
        formData.append('images', file);
      });

      console.log("📋 Submitting property with", uploadedFiles.length, "images");
      console.log("📋 FormData entries:");
      for (let pair of formData.entries()) {
        if (pair[1] instanceof File) {
          console.log(`  ${pair[0]}: [File] ${pair[1].name}`);
        } else {
          console.log(`  ${pair[0]}:`, pair[1]);
        }
      }

      const response = await addProperty(formData);
      console.log("API response:", response);

      if (response.success) {
        setSuccess("Property added successfully! Redirecting...");
        setTimeout(() => {
          router.push("/dashboard-my-properties");
        }, 2000);
      } else {
        setError(response.message || "Failed to add property. Please try again.");
      }
    } catch (err) {
      setError(err.message || "Failed to add property. Please try again.");
      console.error("Submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show mb30" role="alert">
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
        <div className="alert alert-success alert-dismissible fade show mb30" role="alert">
          {success}
        </div>
      )}

      {/* KYC Warning for Sellers/Brokers */}
      {!checkingKyc && (userRole === "seller" || userRole === "broker") && kycStatus !== "verified" && (
        <div className="alert alert-warning mb30" role="alert">
          <h5 className="alert-heading">
            <i className="fas fa-exclamation-triangle me-2"></i>
            KYC Verification Required
          </h5>
          <p className="mb-2">
            You need to complete KYC verification before you can add properties.
          </p>
          <p className="mb-3">
            <strong>Current Status: </strong>
            <span className="badge bg-warning text-dark">
              {kycStatus === "not_submitted" ? "Not Submitted" :
               kycStatus === "pending" ? "Pending Review" :
               kycStatus === "rejected" ? "Rejected" : kycStatus}
            </span>
          </p>
          <a href="/kyc-verification" className="btn btn-warning btn-sm">
            <i className="fas fa-id-card me-2"></i>
            {kycStatus === "not_submitted" ? "Submit KYC Now" : "View KYC Status"}
          </a>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate style={{
        opacity: (!checkingKyc && (userRole === "seller" || userRole === "broker") && kycStatus !== "verified") ? 0.5 : 1,
        pointerEvents: (!checkingKyc && (userRole === "seller" || userRole === "broker") && kycStatus !== "verified") ? 'none' : 'auto'
      }}>
        <nav>
          <div className="nav nav-tabs" id="nav-tab2" role="tablist">
            <button
              className={`nav-link fw600 ms-3 ${activeTab === "nav-item1" ? "active" : ""}`}
              id="nav-item1-tab"
              onClick={() => setActiveTab("nav-item1")}
              type="button"
              role="tab"
              aria-controls="nav-item1"
              aria-selected={activeTab === "nav-item1"}
            >
              1. Description
            </button>
            <button
              className={`nav-link fw600 ${activeTab === "nav-item2" ? "active" : ""}`}
              id="nav-item2-tab"
              onClick={() => setActiveTab("nav-item2")}
              type="button"
              role="tab"
              aria-controls="nav-item2"
              aria-selected={activeTab === "nav-item2"}
            >
              2. Media
            </button>
            <button
              className={`nav-link fw600 ${activeTab === "nav-item3" ? "active" : ""}`}
              id="nav-item3-tab"
              onClick={() => setActiveTab("nav-item3")}
              type="button"
              role="tab"
              aria-controls="nav-item3"
              aria-selected={activeTab === "nav-item3"}
            >
              3. Location
            </button>
            <button
              className={`nav-link fw600 ${activeTab === "nav-item4" ? "active" : ""}`}
              id="nav-item4-tab"
              onClick={() => setActiveTab("nav-item4")}
              type="button"
              role="tab"
              aria-controls="nav-item4"
              aria-selected={activeTab === "nav-item4"}
            >
              4. Detail
            </button>
            <button
              className={`nav-link fw600 ${activeTab === "nav-item5" ? "active" : ""}`}
              id="nav-item5-tab"
              onClick={() => setActiveTab("nav-item5")}
              type="button"
              role="tab"
              aria-controls="nav-item5"
              aria-selected={activeTab === "nav-item5"}
            >
              5. Amenities
            </button>
          </div>
        </nav>
        {/* End nav tabs */}

        <div className="tab-content" id="nav-tabContent">
          <div
            className={`tab-pane fade ${activeTab === "nav-item1" ? "show active" : ""}`}
            id="nav-item1"
            role="tabpanel"
            aria-labelledby="nav-item1-tab"
          >
            <div className="ps-widget bgc-white bdrs12 p30 overflow-hidden position-relative">
              <h4 className="title fz17 mb30">Property Description</h4>
              <PropertyDescription />
              <div className="row mt30">
                <div className="col-12 d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setActiveTab("nav-item2")}
                  >
                    Next: Media →
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* End tab for Property Description */}

          <div
            className={`tab-pane fade ${activeTab === "nav-item2" ? "show active" : ""}`}
            id="nav-item2"
            role="tabpanel"
            aria-labelledby="nav-item2-tab"
          >
            <UploadMedia onFilesChange={setUploadedFiles} />
            <div className="row mt30">
              <div className="col-12 d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => setActiveTab("nav-item1")}
                >
                  ← Previous
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setActiveTab("nav-item3")}
                >
                  Next: Location →
                </button>
              </div>
            </div>
          </div>
          {/* End tab for Upload photos of your property */}

          <div
            className={`tab-pane fade ${activeTab === "nav-item3" ? "show active" : ""}`}
            id="nav-item3"
            role="tabpanel"
            aria-labelledby="nav-item3-tab"
          >
            <div className="ps-widget bgc-white bdrs12 p30 overflow-hidden position-relative">
              <h4 className="title fz17 mb30">Listing Location</h4>
              <LocationField />
              <div className="row mt30">
                <div className="col-12 d-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => setActiveTab("nav-item2")}
                  >
                    ← Previous
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setActiveTab("nav-item4")}
                  >
                    Next: Details →
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* End tab for Listing Location */}

          <div
            className={`tab-pane fade ${activeTab === "nav-item4" ? "show active" : ""}`}
            id="nav-item4"
            role="tabpanel"
            aria-labelledby="nav-item4-tab"
          >
            <div className="ps-widget bgc-white bdrs12 p30 overflow-hidden position-relative">
              <h4 className="title fz17 mb30">Listing Details</h4>
              <DetailsFiled />
              <div className="row mt30">
                <div className="col-12 d-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => setActiveTab("nav-item3")}
                  >
                    ← Previous
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setActiveTab("nav-item5")}
                  >
                    Next: Amenities →
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* End tab for Listing Details */}

          <div
            className={`tab-pane fade ${activeTab === "nav-item5" ? "show active" : ""}`}
            id="nav-item5"
            role="tabpanel"
            aria-labelledby="nav-item5-tab"
          >
            <div className="ps-widget bgc-white bdrs12 p30 overflow-hidden position-relative">
              <h4 className="title fz17 mb30">Select Amenities</h4>
              <div className="row">
                <Amenities />
              </div>
              <div className="row mt30">
                <div className="col-12 d-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => setActiveTab("nav-item4")}
                  >
                    ← Previous
                  </button>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => router.back()}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Submitting...
                        </>
                      ) : (
                        "Submit Property"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* End tab for Select Amenities */}
        </div>
      </form>
    </>
  );
};

export default AddPropertyTabContent;
