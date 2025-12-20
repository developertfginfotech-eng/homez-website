"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { kycAPI } from "@/services/api";
import Image from "next/image";
import Link from "next/link";

const KYCVerification = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    documentType: "passport",
    documentNumber: "",
    fullName: "",
    dateOfBirth: "",
    address: "",
  });
  const [files, setFiles] = useState({
    frontImage: null,
    backImage: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [checking, setChecking] = useState(true);

  // Check if KYC is already submitted on page load
  useEffect(() => {
    const checkKYCStatus = async () => {
      try {
        const response = await kycAPI.getKYCStatus();

        // If KYC exists and has been submitted (any status), redirect to dashboard
        if (response.success && response.kyc) {
          router.push("/dashboard-home");
          return;
        }
      } catch (err) {
        // If 404 or error, user hasn't submitted KYC yet, allow them to continue
        console.log("No existing KYC found, allowing submission");
      } finally {
        setChecking(false);
      }
    };

    checkKYCStatus();
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
    setLoading(true);
    setError("");

    try {
      await kycAPI.submitKYC(formData, files);
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard-home");
      }, 1500);
    } catch (err) {
      setError(err.message || "KYC submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    localStorage.setItem("kycSkipped", "true");
    router.push("/dashboard-home");
  };

  // Show loading while checking KYC status
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
    <div className="our-login">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 m-auto">
            <div className="main-title text-center">
              <h2 className="title">Complete Your KYC Verification</h2>
              <p className="paragraph">
                Please provide your identity verification documents to continue
              </p>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-xl-6 mx-auto">
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
                  {error}
                </div>
              )}
              {success && (
                <div className="alert alert-success mb20" role="alert">
                  KYC submitted successfully! Redirecting...
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb20">
                    <label className="form-label fw600 dark-color">
                      Document Type
                    </label>
                    <select
                      name="documentType"
                      className="form-control"
                      value={formData.documentType}
                      onChange={handleChange}
                      required
                    >
                      <option value="passport">Passport</option>
                      <option value="driving_license">Driving License</option>
                      <option value="aadhar">Aadhar Card</option>
                      <option value="pan_card">PAN Card</option>
                    </select>
                  </div>

                  <div className="col-md-6 mb20">
                    <label className="form-label fw600 dark-color">
                      Document Number
                    </label>
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
                    <label className="form-label fw600 dark-color">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      className="form-control"
                      placeholder="Enter full name as on document"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb20">
                    <label className="form-label fw600 dark-color">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      className="form-control"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-12 mb20">
                    <label className="form-label fw600 dark-color">
                      Address
                    </label>
                    <textarea
                      name="address"
                      className="form-control"
                      rows="2"
                      placeholder="Enter your full address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb20">
                    <label className="form-label fw600 dark-color">
                      Document Front Image
                    </label>
                    <input
                      type="file"
                      name="frontImage"
                      className="form-control"
                      accept="image/*"
                      onChange={handleFileChange}
                      required
                    />
                    {files.frontImage && (
                      <small className="text-success">
                        {files.frontImage.name}
                      </small>
                    )}
                  </div>

                  <div className="col-md-6 mb20">
                    <label className="form-label fw600 dark-color">
                      Document Back Image
                    </label>
                    <input
                      type="file"
                      name="backImage"
                      className="form-control"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    {files.backImage && (
                      <small className="text-success">
                        {files.backImage.name}
                      </small>
                    )}
                  </div>
                </div>

                <div className="d-grid mb20">
                  <button
                    className="ud-btn btn-thm"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit KYC"}
                    {!loading && <i className="fal fa-arrow-right-long" />}
                  </button>
                </div>

                <div className="d-grid mb20">
                  <button
                    className="ud-btn btn-white"
                    type="button"
                    onClick={handleSkip}
                    disabled={loading}
                  >
                    Skip for Now
                  </button>
                </div>
              </form>

              <p className="text-center dark-color mt20">
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

export default KYCVerification;
