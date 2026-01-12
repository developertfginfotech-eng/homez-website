"use client";

import DashboardHeader from "@/components/common/DashboardHeader";
import MobileMenu from "@/components/common/mobile-menu";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import Footer from "@/components/property/dashboard/Footer";
import SidebarDashboard from "@/components/property/dashboard/SidebarDashboard";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const DashboardKYCVerification = () => {
  const router = useRouter();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "",
    country: "UAE",
  });
  const [formData, setFormData] = useState({});
  const [uploading, setUploading] = useState(false);

  const countries = [
    { code: "+971", name: "UAE" },
    { code: "+1", name: "USA" },
    { code: "+351", name: "Portugal" },
    { code: "+1", name: "Canada" },
    { code: "+61", name: "Australia" },
    { code: "+90", name: "Turkey" },
    { code: "+357", name: "Cyprus" },
    { code: "+356", name: "Malta" },
    { code: "+36", name: "Hungary" },
    { code: "+371", name: "Latvia" },
    { code: "+63", name: "Philippines" },
    { code: "+60", name: "Malaysia" },
  ];

  useEffect(() => {
    // Get user data from localStorage
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        countryCode: user.countryCode || "+971",
        country: user.country || "UAE",
      });
    }
  }, []);

  const handleCountryChange = (e) => {
    setUserData({
      ...userData,
      country: e.target.value,
    });
    // Update user country in localStorage
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      user.country = e.target.value;
      localStorage.setItem("user", JSON.stringify(user));
    }
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        [fieldName]: file,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      // TODO: Upload documents to backend
      // For now, simulate upload and mark as verified in localStorage
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mark KYC as verified
      localStorage.setItem("kycVerified", "true");

      // Update user object
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        user.kycVerified = true;
        localStorage.setItem("user", JSON.stringify(user));
      }

      alert("KYC verification submitted successfully! You can now post properties.");
      router.push("/dashboard-add-property");
    } catch (error) {
      console.error("Error uploading KYC documents:", error);
      alert("Failed to upload documents. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSkip = () => {
    localStorage.setItem("kycSkipped", "true");
    router.push("/dashboard-home");
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
                <div className="col-lg-12">
                  <div className="dashboard_title_area">
                    <h2>KYC Verification</h2>
                    <p className="text">Complete your KYC to start posting properties</p>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-12">
                  <div className="bgc-white p30 bdrs12" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                    <form onSubmit={handleSubmit}>
                      {/* User Information Section */}
                      <div className="mb30 p20" style={{ backgroundColor: "#f0f9ff", border: "1px solid #cffafe", borderRadius: "8px" }}>
                        <h5 className="mb20" style={{ fontSize: "18px", fontWeight: "700", color: "#0c4a6e" }}>
                          <i className="fas fa-user-circle me-2"></i>
                          Your Information
                        </h5>
                        <div className="row">
                          <div className="col-md-6">
                            <label className="form-label fw600">Name</label>
                            <input
                              type="text"
                              className="form-control"
                              value={userData.name}
                              disabled
                              style={{
                                padding: "12px",
                                fontSize: "15px",
                                backgroundColor: "#e0f2fe",
                                border: "1px solid #bae6fd",
                                borderRadius: "8px",
                              }}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label fw600">Email</label>
                            <input
                              type="email"
                              className="form-control"
                              value={userData.email}
                              disabled
                              style={{
                                padding: "12px",
                                fontSize: "15px",
                                backgroundColor: "#e0f2fe",
                                border: "1px solid #bae6fd",
                                borderRadius: "8px",
                              }}
                            />
                          </div>
                        </div>

                        <div className="row mt3">
                          <div className="col-md-4">
                            <label className="form-label fw600">Country Code</label>
                            <input
                              type="text"
                              className="form-control"
                              value={userData.countryCode}
                              disabled
                              style={{
                                padding: "12px",
                                fontSize: "15px",
                                backgroundColor: "#e0f2fe",
                                border: "1px solid #bae6fd",
                                borderRadius: "8px",
                              }}
                            />
                          </div>
                          <div className="col-md-8">
                            <label className="form-label fw600">Phone</label>
                            <input
                              type="tel"
                              className="form-control"
                              value={userData.phone}
                              disabled
                              style={{
                                padding: "12px",
                                fontSize: "15px",
                                backgroundColor: "#e0f2fe",
                                border: "1px solid #bae6fd",
                                borderRadius: "8px",
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mb30">
                        <h4 className="mb20" style={{ fontSize: "20px", fontWeight: "700" }}>
                          <i className="fas fa-shield-check me-2" style={{ color: "#eb6753" }}></i>
                          KYC Document Verification
                        </h4>
                        <div className="row">
                          <div className="col-md-6">
                            <label className="form-label fw600">Select Your Country</label>
                            <select
                              className="form-control"
                              value={userData.country}
                              onChange={handleCountryChange}
                              style={{
                                padding: "12px",
                                fontSize: "15px",
                                border: "2px solid #e5e7eb",
                                borderRadius: "8px",
                              }}
                            >
                              {countries.map((country) => (
                                <option key={country.name} value={country.name}>
                                  {country.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      <div
                        className="alert"
                        style={{
                          backgroundColor: "#fef2f0",
                          border: "1px solid #eb6753",
                          borderRadius: "8px",
                          padding: "15px",
                          marginBottom: "25px",
                        }}
                      >
                        <h6 style={{ color: "#eb6753", fontSize: "15px", fontWeight: "700", marginBottom: "8px" }}>
                          <i className="fas fa-info-circle me-2"></i>
                          Documents Required for {userData.country}
                        </h6>
                        <p className="mb-0" style={{ fontSize: "14px", color: "#4a5568" }}>
                          Please upload clear, valid documents. All information will be kept confidential and secure.
                        </p>
                      </div>

                      {/* India Documents */}
                      {userData.country === "India" && (
                        <>
                          <div className="mb25">
                            <label className="form-label fw600">Aadhaar Card *</label>
                            <input
                              type="file"
                              className="form-control"
                              accept="image/*,.pdf"
                              onChange={(e) => handleFileChange(e, "aadhaarCard")}
                              required
                            />
                            <small className="text-muted">Upload front and back side (PDF or Image)</small>
                          </div>

                          <div className="mb25">
                            <label className="form-label fw600">PAN Card *</label>
                            <input
                              type="file"
                              className="form-control"
                              accept="image/*,.pdf"
                              onChange={(e) => handleFileChange(e, "panCard")}
                              required
                            />
                            <small className="text-muted">Upload PAN card (PDF or Image)</small>
                          </div>
                        </>
                      )}

                      {/* USA Documents */}
                      {userData.country === "USA" && (
                        <>
                          <div className="mb25">
                            <label className="form-label fw600">Driver's License *</label>
                            <input
                              type="file"
                              className="form-control"
                              accept="image/*,.pdf"
                              onChange={(e) => handleFileChange(e, "driversLicense")}
                              required
                            />
                          </div>

                          <div className="mb25">
                            <label className="form-label fw600">SSN (Last 4 digits) *</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter last 4 digits of SSN"
                              maxLength="4"
                              required
                            />
                          </div>
                        </>
                      )}

                      {/* UK Documents */}
                      {userData.country === "UK" && (
                        <>
                          <div className="mb25">
                            <label className="form-label fw600">Passport *</label>
                            <input
                              type="file"
                              className="form-control"
                              accept="image/*,.pdf"
                              onChange={(e) => handleFileChange(e, "passport")}
                              required
                            />
                          </div>

                          <div className="mb25">
                            <label className="form-label fw600">National Insurance Number *</label>
                            <input type="text" className="form-control" placeholder="Enter NI Number" required />
                          </div>
                        </>
                      )}

                      {/* Canada Documents */}
                      {userData.country === "Canada" && (
                        <>
                          <div className="mb25">
                            <label className="form-label fw600">Driver's License *</label>
                            <input
                              type="file"
                              className="form-control"
                              accept="image/*,.pdf"
                              onChange={(e) => handleFileChange(e, "driversLicense")}
                              required
                            />
                          </div>

                          <div className="mb25">
                            <label className="form-label fw600">SIN (Last 3 digits) *</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter last 3 digits of SIN"
                              maxLength="3"
                              required
                            />
                          </div>
                        </>
                      )}

                      {/* Australia Documents */}
                      {userData.country === "Australia" && (
                        <>
                          <div className="mb25">
                            <label className="form-label fw600">Driver's License *</label>
                            <input
                              type="file"
                              className="form-control"
                              accept="image/*,.pdf"
                              onChange={(e) => handleFileChange(e, "driversLicense")}
                              required
                            />
                          </div>

                          <div className="mb25">
                            <label className="form-label fw600">TFN (Last 3 digits) *</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter last 3 digits of TFN"
                              maxLength="3"
                              required
                            />
                          </div>
                        </>
                      )}

                      {/* Property Ownership Proof (Optional for all countries) */}
                      <div className="mb25">
                        <label className="form-label fw600">Property Ownership Proof (Optional)</label>
                        <input
                          type="file"
                          className="form-control"
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileChange(e, "propertyOwnership")}
                        />
                        <small className="text-muted">
                          Upload property documents like sale deed, registry, etc.
                        </small>
                      </div>

                      <div
                        className="alert mt30"
                        style={{
                          backgroundColor: "#e0f2fe",
                          border: "1px solid #0284c7",
                          borderRadius: "8px",
                          padding: "20px",
                        }}
                      >
                        <div className="d-flex align-items-start">
                          <i
                            className="fas fa-info-circle me-3"
                            style={{ fontSize: "20px", color: "#0284c7", marginTop: "2px" }}
                          ></i>
                          <div>
                            <h6 style={{ color: "#0c4a6e", fontSize: "15px", fontWeight: "700", marginBottom: "8px" }}>
                              Verification Timeline
                            </h6>
                            <p className="mb-2" style={{ fontSize: "14px", color: "#0c4a6e" }}>
                              Your documents will be verified within 24-48 hours. You'll receive a notification once
                              verified.
                            </p>
                            <p className="mb-0" style={{ fontSize: "13px", color: "#075985" }}>
                              <i className="fas fa-clock me-2"></i>
                              Average verification time: <strong>8-12 hours</strong>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="d-flex gap-3 mt30" style={{ flexWrap: "wrap" }}>
                        <button
                          type="submit"
                          className="btn btn-lg"
                          disabled={uploading}
                          style={{
                            backgroundColor: "#10b981",
                            color: "white",
                            padding: "15px 40px",
                            fontSize: "16px",
                            fontWeight: "600",
                            borderRadius: "8px",
                            border: "none",
                          }}
                        >
                          {uploading ? (
                            <>
                              <i className="fas fa-spinner fa-spin me-2"></i>
                              Uploading...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-check me-2"></i>
                              Submit for Verification
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={handleSkip}
                          className="btn btn-lg"
                          style={{
                            backgroundColor: "#e5e7eb",
                            color: "#6b7280",
                            padding: "15px 40px",
                            fontSize: "16px",
                            fontWeight: "600",
                            borderRadius: "8px",
                            border: "1px solid #d1d5db",
                          }}
                        >
                          <i className="fas fa-times me-2"></i>
                          Skip for Now
                        </button>

                        <button
                          type="button"
                          onClick={() => router.back()}
                          className="btn btn-lg btn-outline-secondary"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardKYCVerification;
