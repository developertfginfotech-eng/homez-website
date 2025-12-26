"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { tourAPI } from "@/services/api";

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

  // Load user data from localStorage on mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
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

  return (
    <div className="ps-navtab">
      <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
        {tabs.map((tab) => (
          <li className="nav-item" key={tab.id} role="presentation">
            <button
              className={`nav-link${
                tab.id === tourType ? " active mr15 mb5-lg" : ""
              }`}
              id={`pills-${tab.id}-tab`}
              type="button"
              role="tab"
              aria-controls={`pills-${tab.id}`}
              aria-selected={tab.id === tourType ? "true" : "false"}
              onClick={() => setTourType(tab.id)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
      {/* End nav-pills */}

      <div className="tab-content" id="pills-tabContent">
        {error && (
          <div className="alert alert-danger mb20" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className="alert alert-success mb20" role="alert">
            Tour request submitted successfully! We will contact you soon.
          </div>
        )}

        {tabs.map((tab) => (
          <div
            className={`tab-pane fade${
              tab.id === tourType ? " show active" : ""
            }`}
            id={`pills-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`pills-${tab.id}-tab`}
            key={tab.id}
          >
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
                    {user && (
                      <small className="text-muted">Using your account name</small>
                    )}
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
                    {user && (
                      <small className="text-muted">Using your account phone</small>
                    )}
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
                    {user && (
                      <small className="text-muted">Using your account email</small>
                    )}
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
                      {loading ? "Submitting..." : "Submit a Tour Request"}
                      {!loading && <i className="fal fa-arrow-right-long" />}
                    </button>
                  </div>
                </div>
                {/* End .col-12 */}
              </div>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleTour;
