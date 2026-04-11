"use client";
import Select from "react-select";
import SingleAgentInfo from "./SingleAgentInfo";
import { useEffect, useState } from "react";
import Link from "next/link";

const InfoWithForm = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    profession: "",
    message: "",
  });

  const inqueryType = [
    { value: "Engineer", label: "Engineer" },
    { value: "Doctor", label: "Doctor" },
    { value: "Employee", label: "Employee" },
    { value: "Businessman", label: "Businessman" },
    { value: "Other", label: "Other" },
  ];

  const customStyles = {
    option: (styles, { isFocused, isSelected, isHovered }) => {
      return {
        ...styles,
        backgroundColor: isSelected
          ? "#eb6753"
          : isHovered
          ? "#eb675312"
          : isFocused
          ? "#eb675312"
          : undefined,
      };
    },
  };

  const [showSelect, setShowSelect] = useState(false);

  useEffect(() => {
    setShowSelect(true);

    // Check if user is logged in
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setIsLoggedIn(true);
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setFormData({
          name: parsedUser.name || "",
          phone: parsedUser.phone || "",
          email: parsedUser.email || "",
          profession: "",
          message: "",
        });
      } catch (err) {
        console.error("Failed to parse user data:", err);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Show login message if user is not logged in
  if (!isLoggedIn) {
    return (
      <>
        <SingleAgentInfo />
        <div className="row">
          <div className="col-md-12">
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
        </div>
      </>
    );
  }

  return (
    <>
      <SingleAgentInfo />

      <div className="row">
        <div className="col-md-12">
          <form className="form-style1 row">
            <div className="col-md-6">
              <div className="mb20">
                <label className="heading-color ff-heading fw600 mb10">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Your Full Name"
                  value={formData.name}
                  readOnly
                  required
                />
                <small className="text-muted">Using your account name</small>
              </div>
            </div>
            {/* End .col */}

            <div className="col-md-6">
              <div className="mb20">
                <label className="heading-color ff-heading fw600 mb10">
                  Phone
                </label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="Enter your phone"
                  value={formData.phone}
                  readOnly
                  required
                />
                <small className="text-muted">Using your account phone</small>
              </div>
            </div>
            {/* End .col */}

            <div className="col-md-6">
              <div className="mb20">
                <label className="heading-color ff-heading fw600 mb10">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Your Email Address"
                  value={formData.email}
                  readOnly
                  required
                />
                <small className="text-muted">Using your account email</small>
              </div>
            </div>
            {/* End .col */}

            <div className="col-md-6">
              <div className="widget-wrapper sideborder-dropdown">
                <label className="heading-color ff-heading fw600 mb10">
                  I&apos;m a
                </label>
                <div className="form-style2 input-group">
                  {showSelect && (
                    <Select
                      defaultValue={[inqueryType[0]]}
                      name="colors"
                      options={inqueryType}
                      styles={customStyles}
                      className="custom-react_select"
                      classNamePrefix="select"
                      required
                      isClearable={false}
                    />
                  )}
                </div>
              </div>
            </div>
            {/* End .col */}

            <div className="col-md-12">
              <div className="mb10">
                <label className="heading-color ff-heading fw600 mb10">
                  Message
                </label>
                <textarea
                  cols={30}
                  rows={4}
                  placeholder="Hello, I am interested in [Renovated apartment at last floor]"
                  defaultValue={""}
                />
              </div>
            </div>
            {/* End .col */}

            <div className="checkbox-style1 d-block d-sm-flex align-items-center justify-content-between mb10">
              <label className="custom_checkbox fz14 ff-heading">
                By submitting this form I agree to Terms of Use
                <input type="checkbox" />
                <span className="checkmark" />
              </label>
            </div>
            {/* End .col */}

            <div className="btn-area mt20">
              <button className="ud-btn btn-white2">
                Request Information <i className="fal fa-arrow-right-long" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default InfoWithForm;
