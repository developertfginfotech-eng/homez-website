"use client";

import { useState } from "react";
import { kycAPI } from "@/services/api";

const KYCModal = ({ onClose, onSkip }) => {
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
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || "KYC submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
      id="kycModal"
      tabIndex="-1"
      aria-labelledby="kycModalLabel"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="kycModalLabel">
              Complete Your KYC Verification
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onSkip}
              aria-label="Close"
            />
          </div>

          <div className="modal-body">
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            {success && (
              <div className="alert alert-success" role="alert">
                KYC submitted successfully! Redirecting...
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
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
                    <option value="driverLicense">Driver's License</option>
                    <option value="nationalId">National ID</option>
                  </select>
                </div>

                <div className="col-md-6 mb-3">
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

                <div className="col-md-6 mb-3">
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

                <div className="col-md-6 mb-3">
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

                <div className="col-md-12 mb-3">
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

                <div className="col-md-6 mb-3">
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
                </div>

                <div className="col-md-6 mb-3">
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
                </div>
              </div>

              <div className="d-flex gap-3 mt-4">
                <button
                  className="ud-btn btn-thm flex-fill"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit KYC"}
                  {!loading && <i className="fal fa-arrow-right-long ms-2" />}
                </button>
                <button
                  className="ud-btn btn-white flex-fill"
                  type="button"
                  onClick={onSkip}
                  disabled={loading}
                >
                  Skip for Now
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KYCModal;
