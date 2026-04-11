"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { tourAPI } from "@/services/api";
import Link from "next/link";

const ScheduleTour = () => {
  const params = useParams();
  const propertyId = params?.id;

  const [tourType, setTourType] = useState("inperson");
  const [formData, setFormData] = useState({
    preferredDate: "",
    time: "",
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load user data from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setIsLoggedIn(true);
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        // Auto-fill user data for logged-in users
        setFormData(prev => ({
          ...prev,
          name: parsedUser.name || "",
          email: parsedUser.email || "",
          phone: parsedUser.phone || "",
        }));
      } catch (err) {
        console.error("Failed to parse user data:", err);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const tabs = [
    {
      id: "inperson",
      label: "In Person",
    },
    {
      id: "videochat",
      label: "Video Chat",
    },
  ];

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
    setSuccess(false);

    try {
      const tourData = {
        propertyId,
        tourType,
        preferredDate: formData.preferredDate,
        time: formData.time,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        message: formData.message,
      };

      await tourAPI.submitTourRequest(tourData);
      setSuccess(true);
      setFormData({
        preferredDate: "",
        time: "",
        name: "",
        phone: "",
        email: "",
        message: "",
      });

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err.message || "Failed to submit tour request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show login message if user is not logged in
  if (!isLoggedIn) {
    return (
      <div className="ps-navtab">
        <div className="alert alert-warning border-warning" role="alert" style={{ padding: '20px', borderRadius: '8px', background: '#fff8e1', border: '1px solid #ffd54f' }}>
          <p className="mb-3" style={{ fontSize: '15px', color: '#333', lineHeight: '1.6' }}>
            You must first <Link href="/login" className="text-decoration-underline fw-bold" style={{ color: '#eb6753' }}>Login</Link> to your USER ACCOUNT to submit requests.
          </p>
          <p className="mb-0" style={{ fontSize: '14px', color: '#666' }}>
            If you haven't registered yet, it's really easy and free.{' '}
            <Link href="/register" className="text-decoration-underline fw-bold" style={{ color: '#eb6753' }}>Signup</Link> here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="ps-navtab">
      <div className="tab-content" id="pills-tabContent">
        {error && (
          <div className="alert alert-danger mb20" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className="alert alert-success mb20" role="alert">
            Enquiry submitted successfully! We will contact you soon.
          </div>
        )}

        <div className="tab-pane fade show active">
            <form className="form-style1" onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-12">
                  <div className="mb20">
                    <label className="form-label fw600 dark-color">
                      Preferred Day
                    </label>
                    <input
                      type="date"
                      name="preferredDate"
                      className="form-control"
                      value={formData.preferredDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                {/* End .col-12 */}

                <div className="col-md-12">
                  <div className="mb20">
                    <label className="form-label fw600 dark-color">
                      Time
                    </label>
                    <input
                      type="time"
                      name="time"
                      className="form-control"
                      value={formData.time}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                {/* End .col-12 */}

                <div className="col-lg-12">
                  <div className="mb20">
                    <label className="form-label fw600 dark-color">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Your Full Name"
                      value={formData.name}
                      onChange={handleChange}
                      readOnly={!!user}
                      required
                    />
                  </div>
                </div>
                {/* End .col-12 */}

                <div className="col-lg-12">
                  <div className="mb20">
                    <label className="form-label fw600 dark-color">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control"
                      placeholder="Your Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      readOnly={!!user}
                      required
                    />
                  </div>
                </div>
                {/* End .col-12 */}

                <div className="col-md-12">
                  <div className="mb20">
                    <label className="form-label fw600 dark-color">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="Your Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      readOnly={!!user}
                      required
                    />
                  </div>
                </div>
                {/* End .col-12 */}

                <div className="col-md-12">
                  <div className="mb10">
                    <label className="form-label fw600 dark-color">
                      Message
                    </label>
                    <textarea
                      cols={30}
                      rows={4}
                      name="message"
                      className="form-control"
                      placeholder="Enter Your Messages"
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                {/* End .col-12 */}

                <div className="col-md-12">
                  <div className="d-grid">
                    <button
                      type="submit"
                      className="ud-btn btn-thm"
                      disabled={loading}
                    >
                      {loading ? "Submitting..." : "Submit Enquiry"}
                      {!loading && <i className="fal fa-arrow-right-long" />}
                    </button>
                  </div>
                </div>
                {/* End .col-12 */}
              </div>
            </form>
          </div>
      </div>
    </div>
  );
};

export default ScheduleTour;
