"use client";

import { useState } from "react";
import { authAPI } from "@/utils/api";

const AuthModal = ({ isOpen, onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "seller", // seller, buyer, broker
    country: "India",
    // KYC fields
    aadhaarCard: null,
    panCard: null,
    driversLicense: null,
    ssn: "",
    passport: null,
    nationalInsuranceNumber: "",
    sin: "",
    tfn: "",
    propertyOwnership: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const countries = ["India", "USA", "UK", "Canada", "Australia"];
  const needsKYC = formData.role === "seller" || formData.role === "broker";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let response;
      if (isLogin) {
        response = await authAPI.login({
          email: formData.email,
          password: formData.password,
        });
      } else {
        response = await authAPI.register(formData);
      }

      if (response.success) {
        // Store user data
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(response.user));
        }
        onSuccess();
        onClose();
      } else {
        setError(response.message || "Authentication failed");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header border-0">
            <h5 className="modal-title fw600">
              {isLogin ? "Login to Continue" : "Create Your Account"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body">
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="mb20">
                  <label className="form-label fw600">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required={!isLogin}
                  />
                </div>
              )}

              <div className="mb20">
                <label className="form-label fw600">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {!isLogin && (
                <div className="mb20">
                  <label className="form-label fw600">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    placeholder="Enter your phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required={!isLogin}
                  />
                </div>
              )}

              <div className="mb20">
                <label className="form-label fw600">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {!isLogin && (
                <div className="mb20">
                  <label className="form-label fw600">I am a</label>
                  <select
                    name="role"
                    className="form-select"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="seller">Property Owner</option>
                    <option value="broker">Broker/Agent</option>
                    <option value="buyer">Buyer/Tenant</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-lg w-100"
                disabled={loading}
                style={{
                  backgroundColor: "#eb6753",
                  color: "white",
                  fontWeight: "600",
                }}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin me-2"></i>
                    Please wait...
                  </>
                ) : isLogin ? (
                  "Login"
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>

            <div className="text-center mt25">
              {isLogin ? (
                <p className="mb-0">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    className="btn-link"
                    onClick={() => {
                      setIsLogin(false);
                      setError("");
                    }}
                    style={{ color: "#eb6753", textDecoration: "none" }}
                  >
                    Sign Up
                  </button>
                </p>
              ) : (
                <p className="mb-0">
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="btn-link"
                    onClick={() => {
                      setIsLogin(true);
                      setError("");
                    }}
                    style={{ color: "#eb6753", textDecoration: "none" }}
                  >
                    Login
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
