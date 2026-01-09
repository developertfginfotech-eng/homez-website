"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { kycAPI } from "@/services/api";
import Image from "next/image";
import Link from "next/link";

const PropertyKYCVerification = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [country, setCountry] = useState("India");

  const [formData, setFormData] = useState({
    // Personal Information
    fullName: "",
    dateOfBirth: "",
    nationality: "",
    phone: "",
    email: "",
    country: "India",

    // Address Information
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",

    // Identity Documents
    documentType: "passport",
    documentNumber: "",
    documentIssueDate: "",
    documentExpiryDate: "",

    // Property Seller Specific
    sellerType: "individual", // individual or company
    companyName: "",
    companyRegistrationNumber: "",
    taxIdentificationNumber: "",

    // Banking Information
    bankName: "",
    bankAccountNumber: "",
    bankIFSC: "",
    bankAccountType: "savings",

    // Additional Country-Specific Fields
    aadhaarNumber: "",
    panNumber: "",
    ssnLast4: "",
    niNumber: "",
    sinLast3: "",
    tfnLast3: "",

    // Property Details
    propertyOwnershipStatus: "owner", // owner, authorized_seller, broker
    numberOfProperties: "1",
    propertyExperience: "first_time", // first_time, experienced

    // Agreement
    agreeToTerms: false,
    agreeToDataProcessing: false,
  });

  const [files, setFiles] = useState({
    frontImage: null,
    backImage: null,
    aadhaarCard: null,
    panCard: null,
    driversLicense: null,
    passport: null,
    propertyOwnership: null,
    businessLicense: null,
    taxDocument: null,
    bankStatement: null,
    addressProof: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [checking, setChecking] = useState(true);

  const countries = [
    "India",
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "United Arab Emirates",
    "Singapore",
    "Germany",
    "France",
    "Japan"
  ];

  // Check if KYC is already submitted on page load
  useEffect(() => {
    const checkKYCStatus = async () => {
      try {
        const response = await kycAPI.getKYCStatus();
        if (response.success && response.kyc) {
          router.push("/dashboard-home");
          return;
        }
      } catch (err) {
        console.log("No existing KYC found, allowing submission");
      } finally {
        setChecking(false);
      }
    };

    checkKYCStatus();
  }, [router]);

  useEffect(() => {
    setFormData(prev => ({ ...prev, country }));
  }, [country]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  };

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target;
    if (fileList && fileList[0]) {
      setFiles((prev) => ({
        ...prev,
        [name]: fileList[0],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.agreeToTerms || !formData.agreeToDataProcessing) {
      setError("Please agree to the terms and conditions");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await kycAPI.submitKYC(formData, files);
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard-home");
      }, 2000);
    } catch (err) {
      setError(err.message || "KYC submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  if (checking) {
    return (
      <div className="our-login">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 m-auto">
              <div className="main-title text-center mt-5">
                <h2 className="title">Loading...</h2>
                <p className="paragraph">Checking your KYC status</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="our-login" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", paddingTop: "60px", paddingBottom: "60px" }}>
      <div className="container">
        <div className="row">
          <div className="col-lg-10 mx-auto">
            <div className="main-title text-center mb40">
              <h2 className="title" style={{ fontSize: "32px", fontWeight: "700" }}>
                Property Seller KYC Verification
              </h2>
              <p className="paragraph" style={{ fontSize: "16px", color: "#6b7280" }}>
                Complete your identity verification to start listing properties
              </p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="row mb40">
          <div className="col-lg-10 mx-auto">
            <div className="d-flex justify-content-between align-items-center" style={{ position: "relative" }}>
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="text-center" style={{ flex: 1, zIndex: 1 }}>
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      backgroundColor: step >= s ? "#eb6753" : "#e5e7eb",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "20px",
                      fontWeight: "700",
                      margin: "0 auto 10px",
                      transition: "all 0.3s ease"
                    }}
                  >
                    {s}
                  </div>
                  <small style={{ fontSize: "13px", fontWeight: "600", color: step >= s ? "#eb6753" : "#9ca3af" }}>
                    {s === 1 && "Personal Info"}
                    {s === 2 && "Identity Docs"}
                    {s === 3 && "Business Info"}
                    {s === 4 && "Review & Submit"}
                  </small>
                </div>
              ))}
              <div
                style={{
                  position: "absolute",
                  top: "25px",
                  left: "10%",
                  right: "10%",
                  height: "2px",
                  backgroundColor: "#e5e7eb",
                  zIndex: 0
                }}
              >
                <div
                  style={{
                    height: "100%",
                    backgroundColor: "#eb6753",
                    width: `${((step - 1) / 3) * 100}%`,
                    transition: "width 0.3s ease"
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-10 mx-auto">
            <div className="log-reg-form search-modal form-style1 bgc-white p50 p30-sm default-box-shadow1 bdrs12">
              <div className="text-center mb40">
                <Image
                  width={138}
                  height={44}
                  src="/images/header-logo2.svg"
                  alt="Header Logo"
                  className="mx-auto"
                />
              </div>

              {error && (
                <div className="alert alert-danger mb20" role="alert">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {error}
                </div>
              )}
              {success && (
                <div className="alert alert-success mb20" role="alert">
                  <i className="fas fa-check-circle me-2"></i>
                  KYC submitted successfully! Redirecting to dashboard...
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Step 1: Personal Information */}
                {step === 1 && (
                  <div className="step-content">
                    <h4 className="mb30" style={{ fontSize: "22px", fontWeight: "700", color: "#1f2937" }}>
                      <i className="fas fa-user-circle me-2" style={{ color: "#eb6753" }}></i>
                      Personal Information
                    </h4>

                    <div className="row">
                      <div className="col-md-6 mb20">
                        <label className="form-label fw600 dark-color">Country *</label>
                        <select
                          name="country"
                          className="form-control"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          required
                        >
                          {countries.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-6 mb20">
                        <label className="form-label fw600 dark-color">Full Name *</label>
                        <input
                          type="text"
                          name="fullName"
                          className="form-control"
                          placeholder="Enter full name as per documents"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-md-6 mb20">
                        <label className="form-label fw600 dark-color">Date of Birth *</label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          className="form-control"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-md-6 mb20">
                        <label className="form-label fw600 dark-color">Nationality *</label>
                        <input
                          type="text"
                          name="nationality"
                          className="form-control"
                          placeholder="Enter nationality"
                          value={formData.nationality}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-md-6 mb20">
                        <label className="form-label fw600 dark-color">Phone Number *</label>
                        <input
                          type="tel"
                          name="phone"
                          className="form-control"
                          placeholder="Enter phone number"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-md-6 mb20">
                        <label className="form-label fw600 dark-color">Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          placeholder="Enter email address"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-md-12 mb20">
                        <label className="form-label fw600 dark-color">Address Line 1 *</label>
                        <input
                          type="text"
                          name="addressLine1"
                          className="form-control"
                          placeholder="Street address"
                          value={formData.addressLine1}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-md-12 mb20">
                        <label className="form-label fw600 dark-color">Address Line 2</label>
                        <input
                          type="text"
                          name="addressLine2"
                          className="form-control"
                          placeholder="Apartment, suite, etc. (optional)"
                          value={formData.addressLine2}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-4 mb20">
                        <label className="form-label fw600 dark-color">City *</label>
                        <input
                          type="text"
                          name="city"
                          className="form-control"
                          placeholder="City"
                          value={formData.city}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-md-4 mb20">
                        <label className="form-label fw600 dark-color">State/Province *</label>
                        <input
                          type="text"
                          name="state"
                          className="form-control"
                          placeholder="State or Province"
                          value={formData.state}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-md-4 mb20">
                        <label className="form-label fw600 dark-color">ZIP/Postal Code *</label>
                        <input
                          type="text"
                          name="zipCode"
                          className="form-control"
                          placeholder="ZIP/Postal Code"
                          value={formData.zipCode}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Identity Documents */}
                {step === 2 && (
                  <div className="step-content">
                    <h4 className="mb30" style={{ fontSize: "22px", fontWeight: "700", color: "#1f2937" }}>
                      <i className="fas fa-id-card me-2" style={{ color: "#eb6753" }}></i>
                      Identity Verification
                    </h4>

                    <div
                      className="alert mb30"
                      style={{ backgroundColor: "#fef2f0", border: "1px solid #eb6753", borderRadius: "8px" }}
                    >
                      <h6 style={{ color: "#eb6753", fontSize: "15px", fontWeight: "700", marginBottom: "8px" }}>
                        <i className="fas fa-info-circle me-2"></i>
                        Documents Required for {country}
                      </h6>
                      <p className="mb-0" style={{ fontSize: "14px", color: "#4a5568" }}>
                        Please upload clear, valid documents. All information will be kept confidential and secure.
                      </p>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb20">
                        <label className="form-label fw600 dark-color">Document Type *</label>
                        <select
                          name="documentType"
                          className="form-control"
                          value={formData.documentType}
                          onChange={handleChange}
                          required
                        >
                          <option value="passport">Passport</option>
                          <option value="driving_license">Driving License</option>
                          <option value="national_id">National ID Card</option>
                          {country === "India" && <option value="aadhar">Aadhar Card</option>}
                        </select>
                      </div>

                      <div className="col-md-6 mb20">
                        <label className="form-label fw600 dark-color">Document Number *</label>
                        <input
                          type="text"
                          name="documentNumber"
                          className="form-control"
                          placeholder="Enter document number"
                          value={formData.documentNumber}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-md-6 mb20">
                        <label className="form-label fw600 dark-color">Document Issue Date *</label>
                        <input
                          type="date"
                          name="documentIssueDate"
                          className="form-control"
                          value={formData.documentIssueDate}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-md-6 mb20">
                        <label className="form-label fw600 dark-color">Document Expiry Date *</label>
                        <input
                          type="date"
                          name="documentExpiryDate"
                          className="form-control"
                          value={formData.documentExpiryDate}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-md-6 mb20">
                        <label className="form-label fw600 dark-color">Document Front Image *</label>
                        <input
                          type="file"
                          name="frontImage"
                          className="form-control"
                          accept="image/*,.pdf"
                          onChange={handleFileChange}
                          required
                        />
                        {files.frontImage && (
                          <small className="text-success">
                            <i className="fas fa-check-circle me-1"></i>
                            {files.frontImage.name}
                          </small>
                        )}
                      </div>

                      <div className="col-md-6 mb20">
                        <label className="form-label fw600 dark-color">Document Back Image</label>
                        <input
                          type="file"
                          name="backImage"
                          className="form-control"
                          accept="image/*,.pdf"
                          onChange={handleFileChange}
                        />
                        {files.backImage && (
                          <small className="text-success">
                            <i className="fas fa-check-circle me-1"></i>
                            {files.backImage.name}
                          </small>
                        )}
                      </div>

                      {/* Country-Specific Documents */}
                      {country === "India" && (
                        <>
                          <div className="col-md-6 mb20">
                            <label className="form-label fw600 dark-color">Aadhaar Number *</label>
                            <input
                              type="text"
                              name="aadhaarNumber"
                              className="form-control"
                              placeholder="Enter 12-digit Aadhaar number"
                              value={formData.aadhaarNumber}
                              onChange={handleChange}
                              maxLength="12"
                              required
                            />
                          </div>

                          <div className="col-md-6 mb20">
                            <label className="form-label fw600 dark-color">PAN Number *</label>
                            <input
                              type="text"
                              name="panNumber"
                              className="form-control"
                              placeholder="Enter PAN number"
                              value={formData.panNumber}
                              onChange={handleChange}
                              maxLength="10"
                              required
                            />
                          </div>

                          <div className="col-md-6 mb20">
                            <label className="form-label fw600 dark-color">Aadhaar Card Document *</label>
                            <input
                              type="file"
                              name="aadhaarCard"
                              className="form-control"
                              accept="image/*,.pdf"
                              onChange={handleFileChange}
                              required
                            />
                          </div>

                          <div className="col-md-6 mb20">
                            <label className="form-label fw600 dark-color">PAN Card Document *</label>
                            <input
                              type="file"
                              name="panCard"
                              className="form-control"
                              accept="image/*,.pdf"
                              onChange={handleFileChange}
                              required
                            />
                          </div>
                        </>
                      )}

                      {country === "United States" && (
                        <div className="col-md-6 mb20">
                          <label className="form-label fw600 dark-color">SSN Last 4 Digits *</label>
                          <input
                            type="text"
                            name="ssnLast4"
                            className="form-control"
                            placeholder="Last 4 digits of SSN"
                            value={formData.ssnLast4}
                            onChange={handleChange}
                            maxLength="4"
                            required
                          />
                        </div>
                      )}

                      {country === "United Kingdom" && (
                        <div className="col-md-6 mb20">
                          <label className="form-label fw600 dark-color">National Insurance Number *</label>
                          <input
                            type="text"
                            name="niNumber"
                            className="form-control"
                            placeholder="Enter NI Number"
                            value={formData.niNumber}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      )}

                      {country === "Canada" && (
                        <div className="col-md-6 mb20">
                          <label className="form-label fw600 dark-color">SIN Last 3 Digits *</label>
                          <input
                            type="text"
                            name="sinLast3"
                            className="form-control"
                            placeholder="Last 3 digits of SIN"
                            value={formData.sinLast3}
                            onChange={handleChange}
                            maxLength="3"
                            required
                          />
                        </div>
                      )}

                      {country === "Australia" && (
                        <div className="col-md-6 mb20">
                          <label className="form-label fw600 dark-color">TFN Last 3 Digits *</label>
                          <input
                            type="text"
                            name="tfnLast3"
                            className="form-control"
                            placeholder="Last 3 digits of TFN"
                            value={formData.tfnLast3}
                            onChange={handleChange}
                            maxLength="3"
                            required
                          />
                        </div>
                      )}

                      <div className="col-md-12 mb20">
                        <label className="form-label fw600 dark-color">Address Proof (Utility Bill, Bank Statement) *</label>
                        <input
                          type="file"
                          name="addressProof"
                          className="form-control"
                          accept="image/*,.pdf"
                          onChange={handleFileChange}
                          required
                        />
                        <small className="text-muted">Upload a recent utility bill or bank statement (not older than 3 months)</small>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Business & Banking Information */}
                {step === 3 && (
                  <div className="step-content">
                    <h4 className="mb30" style={{ fontSize: "22px", fontWeight: "700", color: "#1f2937" }}>
                      <i className="fas fa-briefcase me-2" style={{ color: "#eb6753" }}></i>
                      Business & Banking Details
                    </h4>

                    <div className="row">
                      <div className="col-md-6 mb20">
                        <label className="form-label fw600 dark-color">Seller Type *</label>
                        <select
                          name="sellerType"
                          className="form-control"
                          value={formData.sellerType}
                          onChange={handleChange}
                          required
                        >
                          <option value="individual">Individual</option>
                          <option value="company">Company/Business</option>
                        </select>
                      </div>

                      {formData.sellerType === "company" && (
                        <>
                          <div className="col-md-6 mb20">
                            <label className="form-label fw600 dark-color">Company Name *</label>
                            <input
                              type="text"
                              name="companyName"
                              className="form-control"
                              placeholder="Enter company name"
                              value={formData.companyName}
                              onChange={handleChange}
                              required
                            />
                          </div>

                          <div className="col-md-6 mb20">
                            <label className="form-label fw600 dark-color">Company Registration Number *</label>
                            <input
                              type="text"
                              name="companyRegistrationNumber"
                              className="form-control"
                              placeholder="Enter registration number"
                              value={formData.companyRegistrationNumber}
                              onChange={handleChange}
                              required
                            />
                          </div>

                          <div className="col-md-6 mb20">
                            <label className="form-label fw600 dark-color">Business License Document *</label>
                            <input
                              type="file"
                              name="businessLicense"
                              className="form-control"
                              accept="image/*,.pdf"
                              onChange={handleFileChange}
                              required
                            />
                          </div>
                        </>
                      )}

                      <div className="col-md-6 mb20">
                        <label className="form-label fw600 dark-color">Tax Identification Number *</label>
                        <input
                          type="text"
                          name="taxIdentificationNumber"
                          className="form-control"
                          placeholder="Enter TIN/Tax ID"
                          value={formData.taxIdentificationNumber}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-md-6 mb20">
                        <label className="form-label fw600 dark-color">Tax Document *</label>
                        <input
                          type="file"
                          name="taxDocument"
                          className="form-control"
                          accept="image/*,.pdf"
                          onChange={handleFileChange}
                          required
                        />
                        <small className="text-muted">Upload tax return or tax registration certificate</small>
                      </div>

                      <div className="col-md-6 mb20">
                        <label className="form-label fw600 dark-color">Property Ownership Status *</label>
                        <select
                          name="propertyOwnershipStatus"
                          className="form-control"
                          value={formData.propertyOwnershipStatus}
                          onChange={handleChange}
                          required
                        >
                          <option value="owner">Property Owner</option>
                          <option value="authorized_seller">Authorized Seller</option>
                          <option value="broker">Real Estate Broker</option>
                        </select>
                      </div>

                      <div className="col-md-6 mb20">
                        <label className="form-label fw600 dark-color">Number of Properties to List *</label>
                        <select
                          name="numberOfProperties"
                          className="form-control"
                          value={formData.numberOfProperties}
                          onChange={handleChange}
                          required
                        >
                          <option value="1">1 Property</option>
                          <option value="2-5">2-5 Properties</option>
                          <option value="6-10">6-10 Properties</option>
                          <option value="10+">More than 10 Properties</option>
                        </select>
                      </div>

                      <div className="col-md-6 mb20">
                        <label className="form-label fw600 dark-color">Property Selling Experience *</label>
                        <select
                          name="propertyExperience"
                          className="form-control"
                          value={formData.propertyExperience}
                          onChange={handleChange}
                          required
                        >
                          <option value="first_time">First Time Seller</option>
                          <option value="experienced">Experienced Seller</option>
                        </select>
                      </div>

                      <div className="col-md-12 mb20">
                        <label className="form-label fw600 dark-color">Property Ownership Proof (Optional)</label>
                        <input
                          type="file"
                          name="propertyOwnership"
                          className="form-control"
                          accept="image/*,.pdf"
                          onChange={handleFileChange}
                        />
                        <small className="text-muted">Upload property documents like sale deed, registry, title deed (optional but recommended)</small>
                      </div>

                      <div className="col-12 mb30">
                        <hr />
                        <h5 className="mb20" style={{ fontSize: "18px", fontWeight: "700" }}>Banking Information</h5>
                      </div>

                      <div className="col-md-6 mb20">
                        <label className="form-label fw600 dark-color">Bank Name *</label>
                        <input
                          type="text"
                          name="bankName"
                          className="form-control"
                          placeholder="Enter bank name"
                          value={formData.bankName}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-md-6 mb20">
                        <label className="form-label fw600 dark-color">Account Type *</label>
                        <select
                          name="bankAccountType"
                          className="form-control"
                          value={formData.bankAccountType}
                          onChange={handleChange}
                          required
                        >
                          <option value="savings">Savings Account</option>
                          <option value="current">Current Account</option>
                          <option value="business">Business Account</option>
                        </select>
                      </div>

                      <div className="col-md-6 mb20">
                        <label className="form-label fw600 dark-color">Account Number *</label>
                        <input
                          type="text"
                          name="bankAccountNumber"
                          className="form-control"
                          placeholder="Enter account number"
                          value={formData.bankAccountNumber}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-md-6 mb20">
                        <label className="form-label fw600 dark-color">
                          {country === "India" ? "IFSC Code" : "Bank Routing Number"} *
                        </label>
                        <input
                          type="text"
                          name="bankIFSC"
                          className="form-control"
                          placeholder={country === "India" ? "Enter IFSC code" : "Enter routing number"}
                          value={formData.bankIFSC}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-md-12 mb20">
                        <label className="form-label fw600 dark-color">Bank Statement (Last 3 months) *</label>
                        <input
                          type="file"
                          name="bankStatement"
                          className="form-control"
                          accept="image/*,.pdf"
                          onChange={handleFileChange}
                          required
                        />
                        <small className="text-muted">Upload recent bank statement for account verification</small>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Review & Submit */}
                {step === 4 && (
                  <div className="step-content">
                    <h4 className="mb30" style={{ fontSize: "22px", fontWeight: "700", color: "#1f2937" }}>
                      <i className="fas fa-clipboard-check me-2" style={{ color: "#eb6753" }}></i>
                      Review & Submit
                    </h4>

                    <div className="alert mb30" style={{ backgroundColor: "#e0f2fe", border: "1px solid #0284c7", borderRadius: "8px" }}>
                      <h6 style={{ color: "#0c4a6e", fontSize: "15px", fontWeight: "700", marginBottom: "8px" }}>
                        <i className="fas fa-info-circle me-2"></i>
                        Verification Timeline
                      </h6>
                      <p className="mb-2" style={{ fontSize: "14px", color: "#0c4a6e" }}>
                        Your documents will be verified within 24-48 hours. You'll receive a notification once verified.
                      </p>
                      <p className="mb-0" style={{ fontSize: "13px", color: "#075985" }}>
                        <i className="fas fa-clock me-2"></i>
                        Average verification time: <strong>8-12 hours</strong>
                      </p>
                    </div>

                    <div className="review-section mb30">
                      <h6 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "15px" }}>Personal Information</h6>
                      <div className="row">
                        <div className="col-md-6 mb15">
                          <small className="text-muted">Full Name</small>
                          <p className="mb-0" style={{ fontWeight: "600" }}>{formData.fullName || "Not provided"}</p>
                        </div>
                        <div className="col-md-6 mb15">
                          <small className="text-muted">Email</small>
                          <p className="mb-0" style={{ fontWeight: "600" }}>{formData.email || "Not provided"}</p>
                        </div>
                        <div className="col-md-6 mb15">
                          <small className="text-muted">Phone</small>
                          <p className="mb-0" style={{ fontWeight: "600" }}>{formData.phone || "Not provided"}</p>
                        </div>
                        <div className="col-md-6 mb15">
                          <small className="text-muted">Country</small>
                          <p className="mb-0" style={{ fontWeight: "600" }}>{formData.country || "Not provided"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="review-section mb30">
                      <h6 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "15px" }}>Business Details</h6>
                      <div className="row">
                        <div className="col-md-6 mb15">
                          <small className="text-muted">Seller Type</small>
                          <p className="mb-0" style={{ fontWeight: "600" }}>
                            {formData.sellerType === "individual" ? "Individual" : "Company/Business"}
                          </p>
                        </div>
                        <div className="col-md-6 mb15">
                          <small className="text-muted">Property Ownership Status</small>
                          <p className="mb-0" style={{ fontWeight: "600" }}>
                            {formData.propertyOwnershipStatus === "owner" ? "Property Owner" :
                             formData.propertyOwnershipStatus === "authorized_seller" ? "Authorized Seller" : "Broker"}
                          </p>
                        </div>
                        <div className="col-md-6 mb15">
                          <small className="text-muted">Number of Properties</small>
                          <p className="mb-0" style={{ fontWeight: "600" }}>{formData.numberOfProperties || "Not provided"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="review-section mb30">
                      <h6 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "15px" }}>Documents Uploaded</h6>
                      <ul className="list-unstyled">
                        {Object.entries(files).map(([key, file]) =>
                          file && (
                            <li key={key} className="mb10">
                              <i className="fas fa-check-circle me-2" style={{ color: "#10b981" }}></i>
                              <span style={{ fontWeight: "600" }}>{key.replace(/([A-Z])/g, ' $1').trim()}:</span> {file.name}
                            </li>
                          )
                        )}
                      </ul>
                    </div>

                    <div className="checkbox-style1 mb20">
                      <label className="custom_checkbox">
                        <input
                          type="checkbox"
                          name="agreeToTerms"
                          checked={formData.agreeToTerms}
                          onChange={handleChange}
                          required
                        />
                        <span className="checkmark" />
                        <span className="ms-2">
                          I agree to the <Link href="/terms" target="_blank" style={{ color: "#eb6753" }}>Terms & Conditions</Link> and <Link href="/privacy" target="_blank" style={{ color: "#eb6753" }}>Privacy Policy</Link>
                        </span>
                      </label>
                    </div>

                    <div className="checkbox-style1 mb30">
                      <label className="custom_checkbox">
                        <input
                          type="checkbox"
                          name="agreeToDataProcessing"
                          checked={formData.agreeToDataProcessing}
                          onChange={handleChange}
                          required
                        />
                        <span className="checkmark" />
                        <span className="ms-2">
                          I consent to the processing of my personal data for KYC verification purposes
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="d-flex justify-content-between mt40">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="btn"
                      style={{
                        backgroundColor: "#f3f4f6",
                        color: "#374151",
                        padding: "12px 30px",
                        fontSize: "15px",
                        fontWeight: "600",
                        borderRadius: "8px",
                        border: "none"
                      }}
                    >
                      <i className="fas fa-arrow-left me-2"></i>
                      Previous
                    </button>
                  )}

                  {step < 4 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="btn ms-auto"
                      style={{
                        backgroundColor: "#eb6753",
                        color: "white",
                        padding: "12px 30px",
                        fontSize: "15px",
                        fontWeight: "600",
                        borderRadius: "8px",
                        border: "none"
                      }}
                    >
                      Next Step
                      <i className="fas fa-arrow-right ms-2"></i>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn ms-auto"
                      style={{
                        backgroundColor: "#10b981",
                        color: "white",
                        padding: "12px 40px",
                        fontSize: "15px",
                        fontWeight: "600",
                        borderRadius: "8px",
                        border: "none"
                      }}
                    >
                      {loading ? (
                        <>
                          <i className="fas fa-spinner fa-spin me-2"></i>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-check me-2"></i>
                          Submit for Verification
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>

              <p className="text-center dark-color mt30">
                Need help?{" "}
                <Link className="dark-color fw600" href="/contact">
                  Contact Support
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyKYCVerification;
