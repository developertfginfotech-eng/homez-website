"use client";

import { useState } from "react";
import Link from "next/link";
import { propertyAPI } from "@/utils/api";

const PropertyDetailsForm = ({ initialData }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // From initial selection
    country: initialData?.country || "",
    state: initialData?.state || "",
    propertyCategory: initialData?.propertyCategory || "residential",
    propertyAdType: initialData?.propertyAdType || "rent",

    // Property Details
    propertyType: "",
    buildingType: "",
    propertyAge: "",
    floor: "",
    totalFloor: "",
    superBuiltUpArea: "",
    carpetArea: "",
    furnishing: "",
    onMainRoad: false,
    cornerProperty: false,

    // Location Details
    city: "",
    locality: "",
    street: "",
    landmark: "",

    // Resale Details
    expectedPrice: "",
    priceNegotiable: false,
    ownershipType: "",
    availableFrom: "",
    bedrooms: "",
    bathrooms: "",
    balconies: "",

    // Amenities
    powerBackup: false,
    lift: false,
    parking: "",
    waterStorage: false,
    security: false,
    gym: false,
    swimmingPool: false,
    garden: false,
    clubHouse: false,
    internetWifi: false,

    // Gallery
    photos: [],
    videos: [],

    // Additional Information
    propertyDescription: "",
    previousOccupancy: "",
    whoWillShow: "",
    paintingService: false,
    cleaningService: false,
    secondaryNumber: "",

    // Schedule
    availabilityDays: "everyday",
    showingTime: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.propertyType) {
      newErrors.propertyType = "Property type Required";
    }
    if (!formData.buildingType) {
      newErrors.buildingType = "Building Type Required";
    }
    if (!formData.propertyAge) {
      newErrors.propertyAge = "Property Age Required";
    }
    if (!formData.floor) {
      newErrors.floor = "Floor Required";
    }
    if (!formData.totalFloor) {
      newErrors.totalFloor = "Total Floor Required";
    }
    if (!formData.superBuiltUpArea) {
      newErrors.superBuiltUpArea = "Built Up Area is Required";
    }
    if (formData.carpetArea && parseFloat(formData.carpetArea) > parseFloat(formData.superBuiltUpArea)) {
      newErrors.carpetArea = "Carpet Area should be less than Built Up Area";
    }
    if (!formData.furnishing) {
      newErrors.furnishing = "Property Furnishing Required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.city) {
      newErrors.city = "City Required";
    }
    if (!formData.locality) {
      newErrors.locality = "Locality Required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};

    if (!formData.expectedPrice) {
      newErrors.expectedPrice = "Expected Price Required";
    }
    if (!formData.ownershipType) {
      newErrors.ownershipType = "Ownership Type Required";
    }
    if (!formData.availableFrom) {
      newErrors.availableFrom = "Available From Date Required";
    }
    if (!formData.bedrooms) {
      newErrors.bedrooms = "Number of Bedrooms Required";
    }
    if (!formData.bathrooms) {
      newErrors.bathrooms = "Number of Bathrooms Required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSave = async () => {
    // Validate current step
    if (currentStep === 1 && !validateStep1()) {
      return;
    }
    if (currentStep === 2 && !validateStep2()) {
      return;
    }
    if (currentStep === 3 && !validateStep3()) {
      return;
    }

    // Save data and move to next step
    console.log("Form data:", formData);

    // Move to next step
    if (currentStep < navigationSteps.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Final step - submit to backend
      setIsSubmitting(true);
      try {
        const response = await propertyAPI.createProperty(formData);

        if (response.success) {
          alert("Property submitted successfully! It will be reviewed by our team.");
          // Redirect to properties page
          window.location.href = "/dashboard-my-properties";
        } else {
          alert(response.message || "Failed to submit property");
        }
      } catch (error) {
        console.error("Submit error:", error);
        alert(error.message || "Failed to submit property. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    return Math.round((currentStep / navigationSteps.length) * 100);
  };

  const navigationSteps = [
    { id: 1, icon: "fas fa-home", label: "Property Details" },
    { id: 2, icon: "fas fa-map-marker-alt", label: "Location Details" },
    { id: 3, icon: "fas fa-building", label: "Resale Details" },
    { id: 4, icon: "fas fa-couch", label: "Amenities" },
    { id: 5, icon: "fas fa-images", label: "Gallery" },
    { id: 6, icon: "fas fa-file-alt", label: "Additional Information" },
    { id: 7, icon: "fas fa-calendar-alt", label: "Schedule" },
  ];

  return (
    <div className="row">
      {/* Left Sidebar Navigation */}
      <div className="col-lg-3 col-xl-2">
        <div className="property-form-nav bgc-white bdrs12 p20 mb30">
          {navigationSteps.map((step) => (
            <div
              key={step.id}
              className={`nav-item d-flex align-items-center mb15 pb15 ${
                currentStep === step.id ? "active" : ""
              } ${currentStep > step.id ? "completed" : ""}`}
              style={{
                borderBottom: "1px solid #eee",
                cursor: "pointer",
              }}
              onClick={() => setCurrentStep(step.id)}
            >
              <i className={`${step.icon} fz20 me-3 ${currentStep === step.id ? "text-thm" : "text-muted"}`}></i>
              <span className={`fz14 ${currentStep === step.id ? "fw600 text-dark" : "text-muted"}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Form Content */}
      <div className="col-lg-6 col-xl-7">
        <div className="property-details-form bgc-white bdrs12 p30">
          <div className="d-flex justify-content-between align-items-center mb30">
            <h4 className="title text-thm mb-0">
              {navigationSteps[currentStep - 1].label}
            </h4>
            <div>
              <span className="fz14 text-muted me-3">{calculateProgress()}% Done</span>
              <button
                type="button"
                className="ud-btn btn-white2"
                style={{
                  padding: "8px 20px",
                  fontSize: "14px",
                }}
              >
                Preview
              </button>
            </div>
          </div>

          {currentStep === 1 && (
            <div className="property-details-step">
              <div className="row">
                {/* Property Type */}
                <div className="col-md-6 mb25">
                  <label className="form-label fw600">
                    Property Type<span className="text-danger">*</span>
                  </label>
                  <select
                    name="propertyType"
                    className={`form-select ${errors.propertyType ? "border-danger" : ""}`}
                    value={formData.propertyType}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="apartment">Apartment</option>
                    <option value="independent-house">Independent House/Villa</option>
                    <option value="gated-community">Gated Community Villa</option>
                    <option value="builder-floor">Builder Floor Apartment</option>
                  </select>
                  {errors.propertyType && (
                    <span className="text-danger fz12">{errors.propertyType}</span>
                  )}
                </div>

                {/* Building Type */}
                <div className="col-md-6 mb25">
                  <label className="form-label fw600">
                    Building Type<span className="text-danger">*</span>
                  </label>
                  <select
                    name="buildingType"
                    className={`form-select ${errors.buildingType ? "border-danger" : ""}`}
                    value={formData.buildingType}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="multi-story">Multi Story Apartment</option>
                    <option value="low-rise">Low Rise Society</option>
                    <option value="high-rise">High Rise Society</option>
                  </select>
                  {errors.buildingType && (
                    <span className="text-danger fz12">{errors.buildingType}</span>
                  )}
                </div>

                {/* Age of Property */}
                <div className="col-md-6 mb25">
                  <label className="form-label fw600">
                    Age of Property<span className="text-danger">*</span>
                  </label>
                  <select
                    name="propertyAge"
                    className={`form-select ${errors.propertyAge ? "border-danger" : ""}`}
                    value={formData.propertyAge}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="0-1">0-1 years</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                  {errors.propertyAge && (
                    <span className="text-danger fz12">{errors.propertyAge}</span>
                  )}
                </div>

                {/* Floor */}
                <div className="col-md-3 mb25">
                  <label className="form-label fw600">
                    Floor<span className="text-danger">*</span>
                  </label>
                  <select
                    name="floor"
                    className={`form-select ${errors.floor ? "border-danger" : ""}`}
                    value={formData.floor}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="ground">Ground</option>
                    {Array.from({ length: 50 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  {errors.floor && (
                    <span className="text-danger fz12">{errors.floor}</span>
                  )}
                </div>

                {/* Total Floor */}
                <div className="col-md-3 mb25">
                  <label className="form-label fw600">
                    Total Floor<span className="text-danger">*</span>
                  </label>
                  <select
                    name="totalFloor"
                    className={`form-select ${errors.totalFloor ? "border-danger" : ""}`}
                    value={formData.totalFloor}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    {Array.from({ length: 100 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  {errors.totalFloor && (
                    <span className="text-danger fz12">{errors.totalFloor}</span>
                  )}
                </div>

                {/* Super Built Up Area */}
                <div className="col-md-6 mb25">
                  <label className="form-label fw600">
                    Super Built Up Area<span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <input
                      type="number"
                      name="superBuiltUpArea"
                      className={`form-control ${errors.superBuiltUpArea ? "border-danger" : ""}`}
                      placeholder="Super Built Up Area"
                      value={formData.superBuiltUpArea}
                      onChange={handleChange}
                    />
                    <span className="input-group-text">Sq.ft</span>
                  </div>
                  {errors.superBuiltUpArea && (
                    <span className="text-danger fz12">{errors.superBuiltUpArea}</span>
                  )}
                </div>

                {/* Carpet Area */}
                <div className="col-md-6 mb25">
                  <label className="form-label fw600">Carpet Area</label>
                  <div className="input-group">
                    <input
                      type="number"
                      name="carpetArea"
                      className={`form-control ${errors.carpetArea ? "border-danger" : ""}`}
                      placeholder="Carpet Area"
                      value={formData.carpetArea}
                      onChange={handleChange}
                    />
                    <span className="input-group-text">Sq.ft</span>
                  </div>
                  {errors.carpetArea && (
                    <span className="text-danger fz12">{errors.carpetArea}</span>
                  )}
                </div>

                {/* Furnishing */}
                <div className="col-md-12 mb25">
                  <label className="form-label fw600">
                    Furnishing<span className="text-danger">*</span>
                  </label>
                  <select
                    name="furnishing"
                    className={`form-select ${errors.furnishing ? "border-danger" : ""}`}
                    value={formData.furnishing}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="fully-furnished">Fully Furnished</option>
                    <option value="semi-furnished">Semi Furnished</option>
                    <option value="unfurnished">Unfurnished</option>
                  </select>
                  {errors.furnishing && (
                    <span className="text-danger fz12">{errors.furnishing}</span>
                  )}
                </div>

                {/* Other Features */}
                <div className="col-md-12 mb25">
                  <label className="form-label fw600">Other Features</label>
                  <div className="d-flex gap-3">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        name="onMainRoad"
                        className="form-check-input"
                        id="onMainRoad"
                        checked={formData.onMainRoad}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="onMainRoad">
                        On Main Road
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        name="cornerProperty"
                        className="form-check-input"
                        id="cornerProperty"
                        checked={formData.cornerProperty}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="cornerProperty">
                        Corner Property
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Help Banner */}
              <div className="help-banner bgc-thm-light p20 bdrs8 mt30 text-center">
                <i className="fas fa-phone text-thm fz20 me-2"></i>
                <span className="fz14">Don't want to fill all the details? Let us help you!</span>
                <button
                  type="button"
                  className="ud-btn btn-white2 ms-3"
                  style={{ padding: "5px 15px", fontSize: "14px" }}
                >
                  I'm interested
                </button>
              </div>

              {/* Navigation Buttons */}
              <div className="d-flex justify-content-center mt30">
                <button
                  type="button"
                  className="ud-btn btn-thm"
                  onClick={handleSave}
                  style={{
                    padding: "15px 60px",
                    fontSize: "16px",
                  }}
                >
                  Save & Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Location Details */}
          {currentStep === 2 && (
            <div className="location-details-step">
              <div className="row">
                {/* City */}
                <div className="col-md-6 mb25">
                  <label className="form-label fw600">
                    City<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    className={`form-control ${errors.city ? "border-danger" : ""}`}
                    placeholder="Enter City"
                    value={formData.city}
                    onChange={handleChange}
                  />
                  {errors.city && (
                    <span className="text-danger fz12">{errors.city}</span>
                  )}
                </div>

                {/* Locality */}
                <div className="col-md-6 mb25">
                  <label className="form-label fw600">
                    Locality/Area<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="locality"
                    className={`form-control ${errors.locality ? "border-danger" : ""}`}
                    placeholder="Enter Locality"
                    value={formData.locality}
                    onChange={handleChange}
                  />
                  {errors.locality && (
                    <span className="text-danger fz12">{errors.locality}</span>
                  )}
                </div>

                {/* Street/Area */}
                <div className="col-md-12 mb25">
                  <label className="form-label fw600">Street/Area</label>
                  <input
                    type="text"
                    name="street"
                    className="form-control"
                    placeholder="Enter Street or Area Name"
                    value={formData.street}
                    onChange={handleChange}
                  />
                </div>

                {/* Landmark */}
                <div className="col-md-12 mb25">
                  <label className="form-label fw600">Landmark (Optional)</label>
                  <input
                    type="text"
                    name="landmark"
                    className="form-control"
                    placeholder="Enter Nearby Landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                  />
                </div>

                {/* Info Box */}
                <div className="col-md-12 mb25">
                  <div className="alert alert-info">
                    <i className="fas fa-info-circle me-2"></i>
                    Adding accurate location helps buyers/tenants find your property easily
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="d-flex justify-content-between mt30">
                <button
                  type="button"
                  className="ud-btn btn-white2"
                  onClick={handleBack}
                  style={{
                    padding: "15px 40px",
                    fontSize: "16px",
                  }}
                >
                  <i className="fas fa-arrow-left me-2"></i>
                  Back
                </button>
                <button
                  type="button"
                  className="ud-btn btn-thm"
                  onClick={handleSave}
                  style={{
                    padding: "15px 60px",
                    fontSize: "16px",
                  }}
                >
                  Save & Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Resale Details */}
          {currentStep === 3 && (
            <div className="resale-details-step">
              <div className="row">
                {/* Expected Price */}
                <div className="col-md-6 mb25">
                  <label className="form-label fw600">
                    Expected Price<span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      type="number"
                      name="expectedPrice"
                      className={`form-control ${errors.expectedPrice ? "border-danger" : ""}`}
                      placeholder="Enter Price"
                      value={formData.expectedPrice}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.expectedPrice && (
                    <span className="text-danger fz12">{errors.expectedPrice}</span>
                  )}
                </div>

                {/* Ownership Type */}
                <div className="col-md-6 mb25">
                  <label className="form-label fw600">
                    Ownership Type<span className="text-danger">*</span>
                  </label>
                  <select
                    name="ownershipType"
                    className={`form-select ${errors.ownershipType ? "border-danger" : ""}`}
                    value={formData.ownershipType}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="freehold">Freehold</option>
                    <option value="leasehold">Leasehold</option>
                    <option value="co-operative">Co-operative Society</option>
                    <option value="power-of-attorney">Power of Attorney</option>
                  </select>
                  {errors.ownershipType && (
                    <span className="text-danger fz12">{errors.ownershipType}</span>
                  )}
                </div>

                {/* Price Negotiable */}
                <div className="col-md-12 mb25">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="priceNegotiable"
                      className="form-check-input"
                      id="priceNegotiable"
                      checked={formData.priceNegotiable}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="priceNegotiable">
                      Price Negotiable
                    </label>
                  </div>
                </div>

                {/* Available From */}
                <div className="col-md-6 mb25">
                  <label className="form-label fw600">
                    Available From<span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    name="availableFrom"
                    className={`form-control ${errors.availableFrom ? "border-danger" : ""}`}
                    value={formData.availableFrom}
                    onChange={handleChange}
                  />
                  {errors.availableFrom && (
                    <span className="text-danger fz12">{errors.availableFrom}</span>
                  )}
                </div>

                {/* Bedrooms */}
                <div className="col-md-4 mb25">
                  <label className="form-label fw600">
                    Bedrooms<span className="text-danger">*</span>
                  </label>
                  <select
                    name="bedrooms"
                    className={`form-select ${errors.bedrooms ? "border-danger" : ""}`}
                    value={formData.bedrooms}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="1">1 BHK</option>
                    <option value="2">2 BHK</option>
                    <option value="3">3 BHK</option>
                    <option value="4">4 BHK</option>
                    <option value="5">5+ BHK</option>
                  </select>
                  {errors.bedrooms && (
                    <span className="text-danger fz12">{errors.bedrooms}</span>
                  )}
                </div>

                {/* Bathrooms */}
                <div className="col-md-4 mb25">
                  <label className="form-label fw600">
                    Bathrooms<span className="text-danger">*</span>
                  </label>
                  <select
                    name="bathrooms"
                    className={`form-select ${errors.bathrooms ? "border-danger" : ""}`}
                    value={formData.bathrooms}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    {Array.from({ length: 10 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  {errors.bathrooms && (
                    <span className="text-danger fz12">{errors.bathrooms}</span>
                  )}
                </div>

                {/* Balconies */}
                <div className="col-md-4 mb25">
                  <label className="form-label fw600">Balconies</label>
                  <select
                    name="balconies"
                    className="form-select"
                    value={formData.balconies}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    {Array.from({ length: 6 }, (_, i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="d-flex justify-content-between mt30">
                <button
                  type="button"
                  className="ud-btn btn-white2"
                  onClick={handleBack}
                  style={{
                    padding: "15px 40px",
                    fontSize: "16px",
                  }}
                >
                  <i className="fas fa-arrow-left me-2"></i>
                  Back
                </button>
                <button
                  type="button"
                  className="ud-btn btn-thm"
                  onClick={handleSave}
                  style={{
                    padding: "15px 60px",
                    fontSize: "16px",
                  }}
                >
                  Save & Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Amenities */}
          {currentStep === 4 && (
            <div className="amenities-step">
              <div className="row">
                <div className="col-md-12 mb20">
                  <h6 className="fw600">Select Available Amenities</h6>
                </div>

                {/* Amenity Checkboxes */}
                <div className="col-md-6 col-lg-4 mb20">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="powerBackup"
                      className="form-check-input"
                      id="powerBackup"
                      checked={formData.powerBackup}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="powerBackup">
                      <i className="fas fa-bolt text-warning me-2"></i>
                      Power Backup
                    </label>
                  </div>
                </div>

                <div className="col-md-6 col-lg-4 mb20">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="lift"
                      className="form-check-input"
                      id="lift"
                      checked={formData.lift}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="lift">
                      <i className="fas fa-elevator text-primary me-2"></i>
                      Lift/Elevator
                    </label>
                  </div>
                </div>

                <div className="col-md-6 col-lg-4 mb20">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="waterStorage"
                      className="form-check-input"
                      id="waterStorage"
                      checked={formData.waterStorage}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="waterStorage">
                      <i className="fas fa-tint text-info me-2"></i>
                      Water Storage
                    </label>
                  </div>
                </div>

                <div className="col-md-6 col-lg-4 mb20">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="security"
                      className="form-check-input"
                      id="security"
                      checked={formData.security}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="security">
                      <i className="fas fa-shield-alt text-success me-2"></i>
                      24x7 Security
                    </label>
                  </div>
                </div>

                <div className="col-md-6 col-lg-4 mb20">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="gym"
                      className="form-check-input"
                      id="gym"
                      checked={formData.gym}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="gym">
                      <i className="fas fa-dumbbell text-danger me-2"></i>
                      Gym/Fitness Center
                    </label>
                  </div>
                </div>

                <div className="col-md-6 col-lg-4 mb20">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="swimmingPool"
                      className="form-check-input"
                      id="swimmingPool"
                      checked={formData.swimmingPool}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="swimmingPool">
                      <i className="fas fa-swimming-pool text-info me-2"></i>
                      Swimming Pool
                    </label>
                  </div>
                </div>

                <div className="col-md-6 col-lg-4 mb20">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="garden"
                      className="form-check-input"
                      id="garden"
                      checked={formData.garden}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="garden">
                      <i className="fas fa-leaf text-success me-2"></i>
                      Garden/Park
                    </label>
                  </div>
                </div>

                <div className="col-md-6 col-lg-4 mb20">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="clubHouse"
                      className="form-check-input"
                      id="clubHouse"
                      checked={formData.clubHouse}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="clubHouse">
                      <i className="fas fa-home text-primary me-2"></i>
                      Club House
                    </label>
                  </div>
                </div>

                <div className="col-md-6 col-lg-4 mb20">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="internetWifi"
                      className="form-check-input"
                      id="internetWifi"
                      checked={formData.internetWifi}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="internetWifi">
                      <i className="fas fa-wifi text-primary me-2"></i>
                      Internet/Wi-Fi
                    </label>
                  </div>
                </div>

                {/* Parking */}
                <div className="col-md-12 mt30 mb25">
                  <label className="form-label fw600">Parking</label>
                  <select
                    name="parking"
                    className="form-select"
                    value={formData.parking}
                    onChange={handleChange}
                  >
                    <option value="">Select Parking</option>
                    <option value="none">No Parking</option>
                    <option value="bike">Bike Parking</option>
                    <option value="car">Car Parking (1)</option>
                    <option value="car-2">Car Parking (2+)</option>
                    <option value="both">Both Car & Bike</option>
                  </select>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="d-flex justify-content-between mt30">
                <button
                  type="button"
                  className="ud-btn btn-white2"
                  onClick={handleBack}
                  style={{
                    padding: "15px 40px",
                    fontSize: "16px",
                  }}
                >
                  <i className="fas fa-arrow-left me-2"></i>
                  Back
                </button>
                <button
                  type="button"
                  className="ud-btn btn-thm"
                  onClick={handleSave}
                  style={{
                    padding: "15px 60px",
                    fontSize: "16px",
                  }}
                >
                  Save & Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Gallery */}
          {currentStep === 5 && (
            <div className="gallery-step">
              <div className="row">
                <div className="col-md-12 mb30">
                  <h6 className="fw600 mb20">Upload Property Photos & Videos</h6>
                  <div className="alert alert-info">
                    <i className="fas fa-info-circle me-2"></i>
                    Properties with photos get 5x more responses. Add at least 3 photos.
                  </div>
                </div>

                {/* Photo Upload */}
                <div className="col-md-12 mb30">
                  <label className="form-label fw600">Property Photos</label>
                  <div className="upload-area border border-2 border-dashed p40 text-center bdrs8">
                    <i className="fas fa-cloud-upload-alt fz40 text-thm mb20"></i>
                    <h6>Drag & Drop Photos Here</h6>
                    <p className="text-muted mb20">or</p>
                    <input
                      type="file"
                      id="photoUpload"
                      multiple
                      accept="image/*"
                      style={{ display: "none" }}
                    />
                    <button
                      type="button"
                      className="ud-btn btn-thm"
                      onClick={() => document.getElementById("photoUpload").click()}
                      style={{ padding: "10px 30px" }}
                    >
                      Browse Files
                    </button>
                    <p className="text-muted fz12 mt15">
                      Supported formats: JPG, PNG, JPEG (Max 10MB each)
                    </p>
                  </div>
                </div>

                {/* Video Upload */}
                <div className="col-md-12 mb30">
                  <label className="form-label fw600">Property Video (Optional)</label>
                  <div className="upload-area border border-2 border-dashed p40 text-center bdrs8">
                    <i className="fas fa-video fz40 text-thm mb20"></i>
                    <h6>Add Property Video</h6>
                    <p className="text-muted mb20">or paste YouTube/Vimeo link</p>
                    <input
                      type="file"
                      id="videoUpload"
                      accept="video/*"
                      style={{ display: "none" }}
                    />
                    <button
                      type="button"
                      className="ud-btn btn-white2"
                      onClick={() => document.getElementById("videoUpload").click()}
                      style={{ padding: "10px 30px" }}
                    >
                      Upload Video
                    </button>
                    <p className="text-muted fz12 mt15">
                      Supported formats: MP4, MOV, AVI (Max 50MB)
                    </p>
                  </div>
                </div>

                {/* WhatsApp Upload Option */}
                <div className="col-md-12 mb25">
                  <div className="bgc-thm-light p20 bdrs8">
                    <div className="d-flex align-items-center">
                      <i className="fab fa-whatsapp fz30 text-success me-3"></i>
                      <div>
                        <h6 className="mb5">Upload via WhatsApp</h6>
                        <p className="text-muted fz14 mb-0">
                          Send photos directly from your phone
                        </p>
                      </div>
                      <button
                        type="button"
                        className="ud-btn btn-success ms-auto"
                        style={{ padding: "8px 20px" }}
                      >
                        Send on WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="d-flex justify-content-between mt30">
                <button
                  type="button"
                  className="ud-btn btn-white2"
                  onClick={handleBack}
                  style={{
                    padding: "15px 40px",
                    fontSize: "16px",
                  }}
                >
                  <i className="fas fa-arrow-left me-2"></i>
                  Back
                </button>
                <button
                  type="button"
                  className="ud-btn btn-thm"
                  onClick={handleSave}
                  style={{
                    padding: "15px 60px",
                    fontSize: "16px",
                  }}
                >
                  Save & Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 6: Additional Information */}
          {currentStep === 6 && (
            <div className="additional-info-step">
              <div className="row">
                {/* Property Description */}
                <div className="col-md-12 mb25">
                  <label className="form-label fw600">Property Description</label>
                  <textarea
                    name="propertyDescription"
                    className="form-control"
                    rows="5"
                    placeholder="Describe your property, nearby facilities, unique features..."
                    value={formData.propertyDescription}
                    onChange={handleChange}
                  ></textarea>
                </div>

                {/* Previous Occupancy */}
                <div className="col-md-6 mb25">
                  <label className="form-label fw600">Previous Occupancy</label>
                  <select
                    name="previousOccupancy"
                    className="form-select"
                    value={formData.previousOccupancy}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="never-occupied">Never Occupied</option>
                    <option value="family">Family</option>
                    <option value="bachelor">Bachelor</option>
                    <option value="company">Company</option>
                  </select>
                </div>

                {/* Who Will Show Property */}
                <div className="col-md-6 mb25">
                  <label className="form-label fw600">Who Will Show Property</label>
                  <select
                    name="whoWillShow"
                    className="form-select"
                    value={formData.whoWillShow}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="owner">I am the Owner</option>
                    <option value="agent">Agent/Broker</option>
                    <option value="relative">Relative</option>
                    <option value="neighbor">Neighbor</option>
                  </select>
                </div>

                {/* Secondary Contact */}
                <div className="col-md-6 mb25">
                  <label className="form-label fw600">Secondary Contact Number</label>
                  <input
                    type="tel"
                    name="secondaryNumber"
                    className="form-control"
                    placeholder="Enter Secondary Number"
                    value={formData.secondaryNumber}
                    onChange={handleChange}
                  />
                </div>

                {/* KYC Documents Section */}
                <div className="col-md-12 mt30 mb20">
                  <h6 className="fw600 mb20">
                    <i className="fas fa-file-alt me-2"></i>
                    KYC Documents (Required)
                  </h6>
                  <div className="alert alert-warning">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    Document requirements vary by country. Please upload valid identification.
                  </div>
                </div>

                {/* Document Upload Based on Country */}
                <div className="col-md-12 mb30">
                  <div className="bgc-f7 p30 bdrs8">
                    {formData.country === "India" && (
                      <>
                        <h6 className="mb20">India - Required Documents</h6>
                        <div className="row">
                          <div className="col-md-6 mb20">
                            <label className="form-label">Aadhaar Card</label>
                            <input type="file" className="form-control" accept=".pdf,.jpg,.png" />
                          </div>
                          <div className="col-md-6 mb20">
                            <label className="form-label">PAN Card</label>
                            <input type="file" className="form-control" accept=".pdf,.jpg,.png" />
                          </div>
                          <div className="col-md-6 mb20">
                            <label className="form-label">Property Ownership Proof</label>
                            <input type="file" className="form-control" accept=".pdf" />
                          </div>
                        </div>
                      </>
                    )}

                    {formData.country === "USA" && (
                      <>
                        <h6 className="mb20">USA - Required Documents</h6>
                        <div className="row">
                          <div className="col-md-6 mb20">
                            <label className="form-label">Driver's License / State ID</label>
                            <input type="file" className="form-control" accept=".pdf,.jpg,.png" />
                          </div>
                          <div className="col-md-6 mb20">
                            <label className="form-label">Social Security Number (SSN)</label>
                            <input type="text" className="form-control" placeholder="XXX-XX-XXXX" />
                          </div>
                          <div className="col-md-6 mb20">
                            <label className="form-label">Property Deed</label>
                            <input type="file" className="form-control" accept=".pdf" />
                          </div>
                        </div>
                      </>
                    )}

                    {formData.country === "UK" && (
                      <>
                        <h6 className="mb20">UK - Required Documents</h6>
                        <div className="row">
                          <div className="col-md-6 mb20">
                            <label className="form-label">Passport / Driving License</label>
                            <input type="file" className="form-control" accept=".pdf,.jpg,.png" />
                          </div>
                          <div className="col-md-6 mb20">
                            <label className="form-label">National Insurance Number</label>
                            <input type="text" className="form-control" placeholder="XX 12 34 56 X" />
                          </div>
                          <div className="col-md-6 mb20">
                            <label className="form-label">Property Title Deeds</label>
                            <input type="file" className="form-control" accept=".pdf" />
                          </div>
                        </div>
                      </>
                    )}

                    {formData.country === "Canada" && (
                      <>
                        <h6 className="mb20">Canada - Required Documents</h6>
                        <div className="row">
                          <div className="col-md-6 mb20">
                            <label className="form-label">Driver's License / Provincial ID</label>
                            <input type="file" className="form-control" accept=".pdf,.jpg,.png" />
                          </div>
                          <div className="col-md-6 mb20">
                            <label className="form-label">Social Insurance Number (SIN)</label>
                            <input type="text" className="form-control" placeholder="XXX-XXX-XXX" />
                          </div>
                          <div className="col-md-6 mb20">
                            <label className="form-label">Property Deed</label>
                            <input type="file" className="form-control" accept=".pdf" />
                          </div>
                        </div>
                      </>
                    )}

                    {formData.country === "Australia" && (
                      <>
                        <h6 className="mb20">Australia - Required Documents</h6>
                        <div className="row">
                          <div className="col-md-6 mb20">
                            <label className="form-label">Driver's License / Proof of Age Card</label>
                            <input type="file" className="form-control" accept=".pdf,.jpg,.png" />
                          </div>
                          <div className="col-md-6 mb20">
                            <label className="form-label">Tax File Number (TFN)</label>
                            <input type="text" className="form-control" placeholder="XXX XXX XXX" />
                          </div>
                          <div className="col-md-6 mb20">
                            <label className="form-label">Property Title Certificate</label>
                            <input type="file" className="form-control" accept=".pdf" />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Additional Services */}
                <div className="col-md-12 mb25">
                  <h6 className="fw600 mb20">Additional Services</h6>
                  <div className="form-check mb15">
                    <input
                      type="checkbox"
                      name="paintingService"
                      className="form-check-input"
                      id="paintingService"
                      checked={formData.paintingService}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="paintingService">
                      I need painting service for my property
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="cleaningService"
                      className="form-check-input"
                      id="cleaningService"
                      checked={formData.cleaningService}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="cleaningService">
                      I need deep cleaning service for my property
                    </label>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="d-flex justify-content-between mt30">
                <button
                  type="button"
                  className="ud-btn btn-white2"
                  onClick={handleBack}
                  style={{
                    padding: "15px 40px",
                    fontSize: "16px",
                  }}
                >
                  <i className="fas fa-arrow-left me-2"></i>
                  Back
                </button>
                <button
                  type="button"
                  className="ud-btn btn-thm"
                  onClick={handleSave}
                  style={{
                    padding: "15px 60px",
                    fontSize: "16px",
                  }}
                >
                  Save & Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 7: Schedule */}
          {currentStep === 7 && (
            <div className="schedule-step">
              <div className="row">
                <div className="col-md-12 mb30">
                  <h6 className="fw600 mb20">When can buyers/tenants view your property?</h6>
                </div>

                {/* Availability Days */}
                <div className="col-md-12 mb30">
                  <label className="form-label fw600">Available Days</label>
                  <div className="btn-group w-100" role="group">
                    <button
                      type="button"
                      className={`btn ${
                        formData.availabilityDays === "everyday"
                          ? "btn-thm"
                          : "btn-outline-secondary"
                      }`}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          availabilityDays: "everyday",
                        }))
                      }
                      style={{ padding: "12px 20px", fontSize: "15px" }}
                    >
                      Everyday
                    </button>
                    <button
                      type="button"
                      className={`btn ${
                        formData.availabilityDays === "weekday"
                          ? "btn-thm"
                          : "btn-outline-secondary"
                      }`}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          availabilityDays: "weekday",
                        }))
                      }
                      style={{ padding: "12px 20px", fontSize: "15px" }}
                    >
                      Weekdays (Mon-Fri)
                    </button>
                    <button
                      type="button"
                      className={`btn ${
                        formData.availabilityDays === "weekend"
                          ? "btn-thm"
                          : "btn-outline-secondary"
                      }`}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          availabilityDays: "weekend",
                        }))
                      }
                      style={{ padding: "12px 20px", fontSize: "15px" }}
                    >
                      Weekends (Sat-Sun)
                    </button>
                  </div>
                </div>

                {/* Preferred Time */}
                <div className="col-md-6 mb25">
                  <label className="form-label fw600">Preferred Showing Time</label>
                  <select
                    name="showingTime"
                    className="form-select"
                    value={formData.showingTime}
                    onChange={handleChange}
                  >
                    <option value="">Select Time</option>
                    <option value="morning">Morning (8 AM - 12 PM)</option>
                    <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                    <option value="evening">Evening (5 PM - 8 PM)</option>
                    <option value="anytime">Anytime</option>
                  </select>
                </div>

                {/* Service Scheduling */}
                {(formData.paintingService || formData.cleaningService) && (
                  <div className="col-md-12 mt30 mb25">
                    <div className="bgc-thm-light p30 bdrs8">
                      <h6 className="fw600 mb20">
                        <i className="fas fa-calendar-check me-2"></i>
                        Schedule Services
                      </h6>
                      {formData.paintingService && (
                        <div className="mb20">
                          <label className="form-label">Painting Service Date</label>
                          <input type="date" className="form-control" />
                        </div>
                      )}
                      {formData.cleaningService && (
                        <div className="mb20">
                          <label className="form-label">Cleaning Service Date</label>
                          <input type="date" className="form-control" />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Success Message */}
                <div className="col-md-12 mt30">
                  <div className="text-center p40 bgc-thm-light bdrs8">
                    <i className="fas fa-check-circle fz50 text-success mb20"></i>
                    <h5 className="mb15">Almost Done!</h5>
                    <p className="text-muted mb-0">
                      Review your property details and submit to make it live
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="d-flex justify-content-between mt30">
                <button
                  type="button"
                  className="ud-btn btn-white2"
                  onClick={handleBack}
                  style={{
                    padding: "15px 40px",
                    fontSize: "16px",
                  }}
                >
                  <i className="fas fa-arrow-left me-2"></i>
                  Back
                </button>
                <button
                  type="button"
                  className="ud-btn btn-success"
                  onClick={handleSave}
                  disabled={isSubmitting}
                  style={{
                    padding: "15px 60px",
                    fontSize: "16px",
                    opacity: isSubmitting ? 0.7 : 1,
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin me-2"></i>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check me-2"></i>
                      Submit Property
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Promotional Content */}
      <div className="col-lg-3 col-xl-3">
        <div className="promo-sidebar bgc-white bdrs12 p30">
          <h5 className="title mb20">Get Tenants Faster</h5>
          <p className="text fz14 mb30">
            Subscribe to our owner plans and find Tenants quickly and with ease
          </p>

          <div className="promo-item text-center mb20">
            <i className="fas fa-shield-alt fz40 text-thm mb10"></i>
            <p className="fz14 fw600 mb-0">Privacy</p>
          </div>

          <div className="promo-item text-center mb20">
            <i className="fas fa-star fz40 text-thm mb10"></i>
            <p className="fz14 fw600 mb-0">Promoted Listing</p>
          </div>

          <div className="promo-item text-center mb20">
            <i className="fab fa-facebook fz40 text-thm mb10"></i>
            <p className="fz14 fw600 mb-0">Social Marketing</p>
          </div>

          <div className="promo-item text-center mb30">
            <i className="fas fa-tag fz40 text-thm mb10"></i>
            <p className="fz14 fw600 mb-0">Price Consultation</p>
          </div>

          <div className="text-center">
            <button
              type="button"
              className="ud-btn btn-thm w-100"
              style={{ padding: "12px 20px" }}
            >
              Show Interest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsForm;
