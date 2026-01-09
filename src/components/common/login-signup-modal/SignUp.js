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
    role: "buyer",
    userType: "individual",
    country: "India",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const countries = ["India", "USA", "UK", "Canada", "Australia"];

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
      // Create user account
      const response = await authAPI.register(formData);
      setSuccess(true);

      if (response.token) {
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("token", response.token);

        if (response.user) {
          response.user.country = formData.country;
          localStorage.setItem("user", JSON.stringify(response.user));
        }

        // Close registration modal
        const modalElement = document.querySelector('[data-bs-dismiss="modal"]');
        if (modalElement) {
          modalElement.click();
        }

        // Redirect everyone to home page after successful registration
        setTimeout(() => {
          window.location.href = "/";
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

      <div className="mb25">
        <label className="form-label fw600 dark-color">Country</label>
        <select
          name="country"
          className="form-control"
          value={formData.country}
          onChange={handleChange}
          required
        >
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>
      {/* End Country */}

      <div className="mb25">
        <label className="form-label fw600 dark-color">I am a</label>
        <select
          name="role"
          className="form-control"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
          <option value="broker">Broker / Agent</option>
        </select>
      </div>
      {/* End Role */}

      <div className="mb25">
        <label className="form-label fw600 dark-color">Account Type</label>
        <select
          name="userType"
          className="form-control"
          value={formData.userType}
          onChange={handleChange}
          required
        >
          <option value="individual">Individual</option>
          <option value="organization">Organization / Company</option>
        </select>
      </div>
      {/* End Account Type */}

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
