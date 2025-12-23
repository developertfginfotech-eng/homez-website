"use client";

import Link from "next/link";
import { useState } from "react";
import { authAPI, kycAPI } from "@/services/api";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authAPI.login(formData.email, formData.password);
      setSuccess(true);

      if (response.token) {
        localStorage.setItem("authToken", response.token);
        if (response.user) {
          localStorage.setItem("user", JSON.stringify(response.user));
        }

        // Close login modal
        const modalElement = document.querySelector('[data-bs-dismiss="modal"]');
        if (modalElement) {
          modalElement.click();
        }

        // Buyers go to home page (no KYC needed)
        if (response.user.role === "buyer") {
          setTimeout(() => {
            window.location.href = "/";
          }, 1500);
          return;
        }

        // Admins go to dashboard (no KYC needed)
        if (response.user.role === "admin") {
          setTimeout(() => {
            window.location.href = "/dashboard-home";
          }, 1500);
          return;
        }

        // Only sellers and brokers need KYC verification
        if (response.user.role === "seller" || response.user.role === "broker") {
          try {
            const kycStatus = await kycAPI.getKYCStatus();

            // If KYC is not verified and not submitted, redirect to KYC page
            if (!kycStatus.verified && !kycStatus.submitted) {
              setTimeout(() => {
                window.location.href = "/kyc-verification";
              }, 1500);
              return;
            }
          } catch (kycErr) {
            // If error checking KYC, redirect to KYC page
            console.error("KYC check error:", kycErr);
            setTimeout(() => {
              window.location.href = "/kyc-verification";
            }, 1500);
            return;
          }
        }

        // If KYC is done, redirect to dashboard
        setTimeout(() => {
          window.location.href = "/dashboard-home";
        }, 1500);
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form-style1" onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-danger mb20" role="alert">
          {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success mb20" role="alert">
          Login successful! Redirecting...
        </div>
      )}

      <div className="mb25">
        <label className="form-label fw600 dark-color">Email</label>
        <input
          type="email"
          name="email"
          className="form-control"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      {/* End email */}

      <div className="mb15">
        <label className="form-label fw600 dark-color">Password</label>
        <input
          type="password"
          name="password"
          className="form-control"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      {/* End Password */}

      <div className="checkbox-style1 d-block d-sm-flex align-items-center justify-content-between mb10">
        <label className="custom_checkbox fz14 ff-heading">
          Remember me
          <input type="checkbox" />
          <span className="checkmark" />
        </label>
        <a className="fz14 ff-heading" href="/forgot-password">
          Lost your password?
        </a>
      </div>
      {/* End  Lost your password? */}

      <div className="d-grid mb20">
        <button
          className="ud-btn btn-thm"
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
          {!loading && <i className="fal fa-arrow-right-long" />}
        </button>
      </div>
      {/* End submit */}

      <div className="hr_content mb20">
        <hr />
        <span className="hr_top_text">OR</span>
      </div>

      <div className="d-grid mb10">
        <button className="ud-btn btn-white" type="button">
          <i className="fab fa-google" /> Continue Google
        </button>
      </div>
      <div className="d-grid mb10">
        <button className="ud-btn btn-fb" type="button">
          <i className="fab fa-facebook-f" /> Continue Facebook
        </button>
      </div>
      <div className="d-grid mb20">
        <button className="ud-btn btn-apple" type="button">
          <i className="fab fa-apple" /> Continue Apple
        </button>
      </div>
      <p className="dark-color text-center mb0 mt10">
        Not signed up?{" "}
        <Link className="dark-color fw600" href="/register">
          Create an account.
        </Link>
      </p>
    </form>
  );
};

export default SignIn;
