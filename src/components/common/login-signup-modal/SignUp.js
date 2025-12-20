"use client";

import Link from "next/link";
import { useState } from "react";
import { authAPI, kycAPI } from "@/services/api";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
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
      const response = await authAPI.register(formData);
      setSuccess(true);

      if (response.token) {
        localStorage.setItem("authToken", response.token);
        if (response.user) {
          localStorage.setItem("user", JSON.stringify(response.user));
        }

        // Close registration modal
        const modalElement = document.querySelector('[data-bs-dismiss="modal"]');
        if (modalElement) {
          modalElement.click();
        }

        // Check KYC status
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

        // If KYC is done, redirect to dashboard
        setTimeout(() => {
          window.location.href = "/dashboard-home";
        }, 1500);
      }
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
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
          Account created successfully! Redirecting...
        </div>
      )}

      <div className="mb25">
        <label className="form-label fw600 dark-color">Name</label>
        <input
          type="text"
          name="name"
          className="form-control"
          placeholder="Enter Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      {/* End Name */}

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
      {/* End Email */}

      <div className="mb25">
        <label className="form-label fw600 dark-color">Phone</label>
        <input
          type="tel"
          name="phone"
          className="form-control"
          placeholder="Enter Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>
      {/* End Phone */}

      <div className="mb20">
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

      <div className="d-grid mb20">
        <button
          className="ud-btn btn-thm"
          type="submit"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create account"}
          {!loading && <i className="fal fa-arrow-right-long" />}
        </button>
      </div>
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
        Already Have an Account?{" "}
        <Link className="dark-color fw600" href="/login">
          Login
        </Link>
      </p>
    </form>
  );
};

export default SignUp;
