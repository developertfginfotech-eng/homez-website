"use client";

import React, { useState, useEffect } from "react";
import { authAPI } from "@/services/api";

const PersonalInfo = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    position: "",
    language: "",
    companyName: "",
    taxNumber: "",
    address: "",
    aboutMe: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await authAPI.getProfile();

        if (response.success && response.user) {
          const user = response.user;
          setFormData({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            position: user.position || "",
            language: user.language || "",
            companyName: user.companyName || "",
            taxNumber: user.taxNumber || "",
            address: user.address || "",
            aboutMe: user.aboutMe || "",
          });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // TODO: Add update profile API call here
      // await authAPI.updateProfile(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.email) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading your profile...</p>
      </div>
    );
  }

  return (
    <form className="form-style1" onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-danger mb20" role="alert">
          {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success mb20" role="alert">
          Profile updated successfully!
        </div>
      )}

      <div className="row">
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Username
            </label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        {/* End .col */}

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        {/* End .col */}

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">Phone</label>
            <input
              type="text"
              name="phone"
              className="form-control"
              placeholder="Your Phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        {/* End .col */}

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              className="form-control"
              placeholder="Your First Name"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
        </div>
        {/* End .col */}

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              className="form-control"
              placeholder="Your Last Name"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
        </div>
        {/* End .col */}

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Position
            </label>
            <input
              type="text"
              name="position"
              className="form-control"
              placeholder="Your Position"
              value={formData.position}
              onChange={handleChange}
            />
          </div>
        </div>
        {/* End .col */}

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Language
            </label>
            <input
              type="text"
              name="language"
              className="form-control"
              placeholder="Your Language"
              value={formData.language}
              onChange={handleChange}
            />
          </div>
        </div>
        {/* End .col */}

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Company Name
            </label>
            <input
              type="text"
              name="companyName"
              className="form-control"
              placeholder="Your Company Name"
              value={formData.companyName}
              onChange={handleChange}
            />
          </div>
        </div>
        {/* End .col */}

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Tax Number
            </label>
            <input
              type="text"
              name="taxNumber"
              className="form-control"
              placeholder="Your Tax Number"
              value={formData.taxNumber}
              onChange={handleChange}
            />
          </div>
        </div>
        {/* End .col */}

        <div className="col-xl-12">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Address
            </label>
            <input
              type="text"
              name="address"
              className="form-control"
              placeholder="Your Address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
        </div>
        {/* End .col */}

        <div className="col-md-12">
          <div className="mb10">
            <label className="heading-color ff-heading fw600 mb10">
              About me
            </label>
            <textarea
              name="aboutMe"
              cols={30}
              rows={4}
              className="form-control"
              placeholder="There are many variations of passages."
              value={formData.aboutMe}
              onChange={handleChange}
            />
          </div>
        </div>
        {/* End .col */}

        <div className="col-md-12">
          <div className="text-end">
            <button
              type="submit"
              className="ud-btn btn-dark"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Profile"}
              <i className="fal fa-arrow-right-long" />
            </button>
          </div>
        </div>
        {/* End .col */}
      </div>
    </form>
  );
};

export default PersonalInfo;
