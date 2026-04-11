"use client";

import DashboardHeader from "@/components/common/DashboardHeader";
import MobileMenu from "@/components/common/mobile-menu";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import Footer from "@/components/property/dashboard/Footer";
import SidebarDashboard from "@/components/property/dashboard/SidebarDashboard";
import PostPropertyForm from "@/components/property/PostPropertyForm";
import PropertyDetailsForm from "@/components/property/PropertyDetailsForm";
import KYCVerificationPrompt from "@/components/property/KYCVerificationPrompt";
import { useState, useEffect } from "react";

const DashboardAddProperty = () => {
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [kycVerified, setKycVerified] = useState(false);
  const [kycPending, setKycPending] = useState(false);
  const [kycChecking, setKycChecking] = useState(true);
  const [userCountry, setUserCountry] = useState("UAE");

  useEffect(() => {
    // Check KYC status - always fetch fresh from API
    const checkKYCStatus = async () => {
      console.log('🔍 Checking KYC status...');
      setKycChecking(true);
      try {
        // Get user data from localStorage
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);

          // Admin users bypass KYC verification completely
          if (user.role === 'admin') {
            console.log('Admin user detected - bypassing KYC check');
            setKycVerified(true);
            setKycPending(false);
            setKycChecking(false);
            return;
          }

          // Buyers cannot add properties
          if (user.role === 'buyer') {
            console.log('Buyer user detected - cannot add properties');
            setKycVerified(false);
            setKycPending(false);
            setKycChecking(false);
            return;
          }

          // Fetch KYC status from API with timeout
          const token = localStorage.getItem("authToken");
          console.log('📋 Token exists:', !!token);

          try {
            // Create abort controller for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kyc/status`, {
              method: "GET",
              headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
              },
              signal: controller.signal
            });

            clearTimeout(timeoutId);

            const data = await response.json();

            if (response.ok && data.success && data.kyc) {
              const kycStatus = data.kyc.status;
              console.log('✓ KYC Status:', kycStatus);
              localStorage.setItem("kycStatus", kycStatus);

              if (kycStatus === "verified") {
                setKycVerified(true);
                setKycPending(false);
              } else if (kycStatus === "pending") {
                setKycVerified(false);
                setKycPending(true);
              } else {
                setKycVerified(false);
                setKycPending(false);
              }
            } else {
              // No KYC record found or invalid response - this is normal for new users
              console.log('ℹ️ No KYC record found - user needs to complete KYC verification');
              localStorage.removeItem("kycStatus");
              setKycVerified(false);
              setKycPending(false);
            }
          } catch (error) {
            // API error or timeout - check cache as fallback
            if (error.name === 'AbortError') {
              console.log('⚠️ KYC check timed out - using cached status');
            } else {
              console.log('ℹ️ Could not check KYC status - using cached status');
            }

            // Check cached KYC status from localStorage as fallback
            const cachedStatus = localStorage.getItem("kycStatus");
            if (cachedStatus === "verified") {
              console.log('Using cached KYC status: verified');
              setKycVerified(true);
              setKycPending(false);
            } else if (cachedStatus === "pending") {
              console.log('Using cached KYC status: pending');
              setKycVerified(false);
              setKycPending(true);
            } else {
              setKycVerified(false);
              setKycPending(false);
            }
          }

          // Set user country
          if (user.country) {
            setUserCountry(user.country);
          }
        }
      } catch (error) {
        console.error("Error checking KYC status:", error);
        setKycVerified(false);
        setKycPending(false);
      } finally {
        setKycChecking(false);
      }
    };

    checkKYCStatus();

    // Set up global handler for form submission
    window.onPropertyFormSubmit = (data) => {
      if (kycVerified) {
        setInitialData(data);
        setShowDetailsForm(true);
      }
    };

    // DON'T auto-load from sessionStorage - always start fresh
    // User should always see the initial selection form first
    // Clear any old data when page loads
    sessionStorage.removeItem("propertyFormData");

    return () => {
      delete window.onPropertyFormSubmit;
    };
  }, [kycVerified]);

  const handleBackToSelection = () => {
    setShowDetailsForm(false);
    sessionStorage.removeItem("propertyFormData");
  };

  return (
    <>
      {/* Main Header Nav */}
      <DashboardHeader />
      {/* End Main Header Nav */}

      {/* Mobile Nav  */}
      <MobileMenu />
      {/* End Mobile Nav  */}

      {/* dashboard_content_wrapper */}
      <div className="dashboard_content_wrapper">
        <div className="dashboard dashboard_wrapper pr30 pr0-md">
          <SidebarDashboard />
          {/* End .dashboard__sidebar */}

          <div className="dashboard__main pl0-md">
            <div className="dashboard__content property-page bgc-f7">
              <div className="row pb40 d-block d-lg-none">
                <div className="col-lg-12">
                  <DboardMobileNavigation />
                </div>
                {/* End .col-12 */}
              </div>
              {/* End .row */}

              {kycChecking ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3">Checking KYC status...</p>
                </div>
              ) : kycPending ? (
                <>
                  <div className="row align-items-center pb30">
                    <div className="col-lg-12">
                      <div className="dashboard_title_area">
                        <h2>Sell or Rent your Property For Free</h2>
                        <p className="text">Post your property and connect with verified buyers/tenants</p>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12">
                      <div
                        className="alert"
                        style={{
                          backgroundColor: "#fef3c7",
                          border: "2px solid #f59e0b",
                          borderRadius: "12px",
                          padding: "30px",
                          maxWidth: "800px",
                          margin: "0 auto",
                        }}
                      >
                        <div className="d-flex align-items-start">
                          <div
                            className="icon-wrapper me-3"
                            style={{
                              backgroundColor: "#f59e0b",
                              borderRadius: "50%",
                              width: "50px",
                              height: "50px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <i className="fas fa-clock" style={{ color: "white", fontSize: "24px" }}></i>
                          </div>
                          <div style={{ flex: 1 }}>
                            <h4 style={{ fontSize: "20px", fontWeight: "700", color: "#92400e", marginBottom: "10px" }}>
                              KYC Verification Pending
                            </h4>
                            <p style={{ fontSize: "15px", color: "#92400e", marginBottom: "15px", lineHeight: "1.6" }}>
                              Your KYC documents have been submitted and are currently under review by our admin team.
                              You'll be able to post properties once your verification is approved.
                            </p>
                            <div
                              className="info-box mt-3 p-3"
                              style={{
                                backgroundColor: "rgba(255,255,255,0.7)",
                                borderRadius: "8px",
                                border: "1px solid #f59e0b",
                              }}
                            >
                              <p className="mb-2" style={{ fontSize: "14px", color: "#78350f", fontWeight: "600" }}>
                                <i className="fas fa-info-circle me-2"></i>
                                What's Next?
                              </p>
                              <ul style={{ fontSize: "14px", color: "#78350f", marginBottom: 0, paddingLeft: "20px" }}>
                                <li>Our admin team will review your documents within 24-48 hours</li>
                                <li>You'll receive a notification once your KYC is verified</li>
                                <li>After verification, you can start posting properties immediately</li>
                              </ul>
                            </div>
                            <div className="mt-3">
                              <span style={{ fontSize: "13px", color: "#92400e" }}>
                                <i className="fas fa-clock me-2"></i>
                                Average verification time: <strong>8-12 hours</strong>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : !kycVerified ? (
                <>
                  <div className="row align-items-center pb30">
                    <div className="col-lg-12">
                      <div className="dashboard_title_area">
                        <h2>Sell or Rent your Property For Free</h2>
                        <p className="text">Post your property and connect with verified buyers/tenants</p>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12">
                      <KYCVerificationPrompt userCountry={userCountry} />
                    </div>
                  </div>
                </>
              ) : !showDetailsForm ? (
                <>
                  <div className="row align-items-center pb30">
                    <div className="col-lg-12">
                      <div className="dashboard_title_area">
                        <h2>Sell or Rent your Property For Free</h2>
                        <p className="text">Post your property and connect with verified buyers/tenants</p>
                      </div>
                    </div>
                  </div>
                  {/* End .row */}

                  <div className="row">
                    {/* Left Side - Why Post Section */}
                    <div className="col-lg-4 col-xl-3 mb30">
                      <div className="why-post-section bgc-white p30 bdrs12">
                        <h4 className="title mb25">Why Post through us?</h4>

                        <div className="benefit-item d-flex mb20">
                          <div className="icon-wrapper me-3">
                            <i className="flaticon-home-1 text-thm fz24"></i>
                          </div>
                          <div>
                            <h5 className="mb10">Wide Exposure</h5>
                            <p className="text-gray-dark">Reach thousands of potential buyers and renters</p>
                          </div>
                        </div>

                        <div className="benefit-item d-flex mb20">
                          <div className="icon-wrapper me-3">
                            <i className="flaticon-verified text-thm fz24"></i>
                          </div>
                          <div>
                            <h5 className="mb10">Verified Buyers</h5>
                            <p className="text-gray-dark">Connect with genuine, verified buyers and tenants</p>
                          </div>
                        </div>

                        <div className="benefit-item d-flex mb20">
                          <div className="icon-wrapper me-3">
                            <i className="flaticon-like text-thm fz24"></i>
                          </div>
                          <div>
                            <h5 className="mb10">Easy Process</h5>
                            <p className="text-gray-dark">Simple and quick property listing process</p>
                          </div>
                        </div>

                        <div className="benefit-item d-flex">
                          <div className="icon-wrapper me-3">
                            <i className="flaticon-dollar text-thm fz24"></i>
                          </div>
                          <div>
                            <h5 className="mb10">Free Posting</h5>
                            <p className="text-gray-dark">Post your property absolutely free</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Property Form */}
                    <div className="col-lg-8 col-xl-9 mb30">
                      <PostPropertyForm />
                    </div>
                  </div>
                </>
              ) : (
                <PropertyDetailsForm initialData={initialData} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
      {/* End Footer */}
    </>
  );
};

export default DashboardAddProperty;
