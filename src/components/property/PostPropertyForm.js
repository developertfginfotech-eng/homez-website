"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const PostPropertyForm = () => {
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState("India");
  const [selectedState, setSelectedState] = useState("");
  const [propertyCategory, setPropertyCategory] = useState("residential");
  const [propertyAdType, setPropertyAdType] = useState("rent");
  const [userPropertiesCount, setUserPropertiesCount] = useState(0);
  const [kycVerified, setKycVerified] = useState(true); // Default to true for backward compatibility

  // Country and States data
  const countryStateData = {
    India: [
      "Andhra Pradesh",
      "Arunachal Pradesh",
      "Assam",
      "Bihar",
      "Chhattisgarh",
      "Delhi",
      "Goa",
      "Gujarat",
      "Haryana",
      "Himachal Pradesh",
      "Jharkhand",
      "Karnataka",
      "Kerala",
      "Madhya Pradesh",
      "Maharashtra",
      "Manipur",
      "Meghalaya",
      "Mizoram",
      "Nagaland",
      "Odisha",
      "Punjab",
      "Rajasthan",
      "Sikkim",
      "Tamil Nadu",
      "Telangana",
      "Tripura",
      "Uttar Pradesh",
      "Uttarakhand",
      "West Bengal",
    ],
    USA: [
      "Alabama",
      "Alaska",
      "Arizona",
      "Arkansas",
      "California",
      "Colorado",
      "Connecticut",
      "Delaware",
      "Florida",
      "Georgia",
      "Hawaii",
      "Idaho",
      "Illinois",
      "Indiana",
      "Iowa",
      "Kansas",
      "Kentucky",
      "Louisiana",
      "Maine",
      "Maryland",
      "Massachusetts",
      "Michigan",
      "Minnesota",
      "Mississippi",
      "Missouri",
      "Montana",
      "Nebraska",
      "Nevada",
      "New Hampshire",
      "New Jersey",
      "New Mexico",
      "New York",
      "North Carolina",
      "North Dakota",
      "Ohio",
      "Oklahoma",
      "Oregon",
      "Pennsylvania",
      "Rhode Island",
      "South Carolina",
      "South Dakota",
      "Tennessee",
      "Texas",
      "Utah",
      "Vermont",
      "Virginia",
      "Washington",
      "West Virginia",
      "Wisconsin",
      "Wyoming",
    ],
    Canada: [
      "Alberta",
      "British Columbia",
      "Manitoba",
      "New Brunswick",
      "Newfoundland and Labrador",
      "Northwest Territories",
      "Nova Scotia",
      "Nunavut",
      "Ontario",
      "Prince Edward Island",
      "Quebec",
      "Saskatchewan",
      "Yukon",
    ],
    UK: [
      "England",
      "Scotland",
      "Wales",
      "Northern Ireland",
    ],
    Australia: [
      "New South Wales",
      "Victoria",
      "Queensland",
      "Western Australia",
      "South Australia",
      "Tasmania",
      "Australian Capital Territory",
      "Northern Territory",
    ],
  };

  // Get states based on selected country
  const availableStates = countryStateData[selectedCountry] || [];

  // Fetch user's property count and check KYC status
  useEffect(() => {
    const fetchPropertyCount = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setUserPropertiesCount(0);
          return;
        }

        // Check KYC status
        const kycStatus = localStorage.getItem("kycVerified");
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          setKycVerified(kycStatus === "true" || user.kycVerified === true);
        }

        // TODO: Replace with actual API call to backend
        // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/my-properties`, {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // });
        // const data = await response.json();
        // setUserPropertiesCount(data.properties?.length || 0);

        // For now, default to 0 for new users
        setUserPropertiesCount(0);
      } catch (error) {
        console.error("Error fetching property count:", error);
        setUserPropertiesCount(0);
      }
    };

    fetchPropertyCount();
  }, []);

  // Reset property ad type when category changes
  useEffect(() => {
    if (propertyCategory === "commercial") {
      // For commercial, default to rent
      setPropertyAdType("rent");
    } else if (propertyCategory === "land") {
      // For land, only resale is available
      setPropertyAdType("resale");
    } else {
      // For residential, default to rent
      setPropertyAdType("rent");
    }
  }, [propertyCategory]);

  // Handle country change - reset state when country changes
  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
    setSelectedState(""); // Reset state selection when country changes
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedCountry) {
      alert("Please select a country");
      return;
    }

    if (!selectedState) {
      alert("Please select a state/province");
      return;
    }

    // Store initial data in sessionStorage
    const initialData = {
      country: selectedCountry,
      state: selectedState,
      propertyCategory,
      propertyAdType,
    };
    sessionStorage.setItem("propertyFormData", JSON.stringify(initialData));

    // Navigate to detailed form - trigger parent component to show form
    if (window.onPropertyFormSubmit) {
      window.onPropertyFormSubmit(initialData);
    }
  };

  return (
    <div className="post-property-form-wrapper bgc-white p30 bdrs12 default-box-shadow1">
      {/* Property Count Info */}
      {userPropertiesCount > 0 && (
        <div className="mb25 text-center">
          <p className="fz14 mb-0" style={{ color: "#6B7280" }}>
            You have already posted{" "}
            <span className="fw600" style={{ color: "#1F2937" }}>{userPropertiesCount} properties</span> on Lahomez{" "}
            <Link href="/dashboard-my-properties" className="text-thm">
              view all
            </Link>
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Country Selector */}
        <div className="mb25">
          <label className="form-label fw600 mb10 fz14">Country</label>
          <select
            className="form-select form-control"
            value={selectedCountry}
            onChange={handleCountryChange}
            style={{
              padding: "12px 16px",
              fontSize: "14px",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              backgroundColor: "white",
              color: "#1F2937",
            }}
          >
            {Object.keys(countryStateData).map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        {/* State/Province Selector */}
        <div className="mb25">
          <label className="form-label fw600 mb10 fz14">
            {selectedCountry === "USA" || selectedCountry === "Canada"
              ? "State/Province"
              : "State"}
          </label>
          <select
            className="form-select form-control"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            style={{
              padding: "12px 16px",
              fontSize: "14px",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              backgroundColor: "white",
              color: "#1F2937",
            }}
          >
            <option value="">
              Select {selectedCountry === "USA" || selectedCountry === "Canada"
                ? "State/Province"
                : "State"}
            </option>
            {availableStates.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        {/* Property Type Tabs */}
        <div className="mb25">
          <label className="form-label fw600 mb15 fz15">Property type</label>
          <div className="property-type-tabs">
            <div className="d-flex w-100 border-bottom" style={{ borderColor: "#E5E7EB" }}>
              <button
                type="button"
                onClick={() => setPropertyCategory("residential")}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  fontSize: "15px",
                  fontWeight: "600",
                  backgroundColor: "transparent",
                  border: "none",
                  borderBottom: propertyCategory === "residential" ? "3px solid #eb6753" : "3px solid transparent",
                  color: propertyCategory === "residential" ? "#1F2937" : "#6B7280",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
              >
                Residential
              </button>
              <button
                type="button"
                onClick={() => setPropertyCategory("commercial")}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  fontSize: "15px",
                  fontWeight: "600",
                  backgroundColor: "transparent",
                  border: "none",
                  borderBottom: propertyCategory === "commercial" ? "3px solid #eb6753" : "3px solid transparent",
                  color: propertyCategory === "commercial" ? "#1F2937" : "#6B7280",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
              >
                Commercial
              </button>
              <button
                type="button"
                onClick={() => setPropertyCategory("land")}
                className="position-relative"
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  fontSize: "15px",
                  fontWeight: "600",
                  backgroundColor: "transparent",
                  border: "none",
                  borderBottom: propertyCategory === "land" ? "3px solid #eb6753" : "3px solid transparent",
                  color: propertyCategory === "land" ? "#1F2937" : "#6B7280",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
              >
                Land/Plot
                <span
                  className="badge bg-danger position-absolute"
                  style={{
                    top: "-5px",
                    right: "10px",
                    fontSize: "9px",
                    padding: "2px 5px",
                  }}
                >
                  New
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Select Property Ad Type */}
        <div className="mb25">
          <label className="form-label fw600 mb10 fz14">Select Property Ad Type</label>
          <div className="row g-3">
            {/* Rent - Show for Residential and Commercial */}
            {(propertyCategory === "residential" || propertyCategory === "commercial") && (
              <div className={`${propertyCategory === "commercial" ? "col-6" : "col-6 col-md-3"}`}>
                <button
                  type="button"
                  className={`btn w-100 ${
                    propertyAdType === "rent" ? "btn-thm" : "btn-outline-secondary"
                  }`}
                  onClick={() => setPropertyAdType("rent")}
                  style={{
                    padding: "12px 16px",
                    fontSize: "14px",
                    fontWeight: "600",
                    borderRadius: "8px",
                    backgroundColor: propertyAdType === "rent" ? "#eb6753" : "white",
                    color: propertyAdType === "rent" ? "white" : "#6B7280",
                    border: "1px solid #E5E7EB",
                    transition: "all 0.3s ease",
                  }}
                >
                  Rent
                </button>
              </div>
            )}

            {/* Resale/Sale - Show for all categories */}
            <div className={`${propertyCategory === "commercial" ? "col-6" : propertyCategory === "land" ? "col-12" : "col-6 col-md-3"}`}>
              <button
                type="button"
                className={`btn w-100 ${
                  propertyAdType === "resale" ? "btn-thm" : "btn-outline-secondary"
                }`}
                onClick={() => setPropertyAdType("resale")}
                style={{
                  padding: "12px 16px",
                  fontSize: "14px",
                  fontWeight: "600",
                  borderRadius: "8px",
                  backgroundColor: propertyAdType === "resale" ? "#eb6753" : "white",
                  color: propertyAdType === "resale" ? "white" : "#6B7280",
                  border: "1px solid #E5E7EB",
                  transition: "all 0.3s ease",
                }}
              >
                {propertyCategory === "commercial" ? "Sale" : "Resale"}
              </button>
            </div>

            {/* PG/Hostel - Only for Residential */}
            {propertyCategory === "residential" && (
              <div className="col-6 col-md-3">
                <button
                  type="button"
                  className={`btn w-100 ${
                    propertyAdType === "pg" ? "btn-thm" : "btn-outline-secondary"
                  }`}
                  onClick={() => setPropertyAdType("pg")}
                  style={{
                    padding: "12px 16px",
                    fontSize: "14px",
                    fontWeight: "600",
                    borderRadius: "8px",
                    backgroundColor: propertyAdType === "pg" ? "#eb6753" : "white",
                    color: propertyAdType === "pg" ? "white" : "#6B7280",
                    border: "1px solid #E5E7EB",
                    transition: "all 0.3s ease",
                  }}
                >
                  PG/Hostel
                </button>
              </div>
            )}

            {/* Flatmates - Only for Residential */}
            {propertyCategory === "residential" && (
              <div className="col-6 col-md-3">
                <button
                  type="button"
                  className={`btn w-100 ${
                    propertyAdType === "flatmates" ? "btn-thm" : "btn-outline-secondary"
                  }`}
                  onClick={() => setPropertyAdType("flatmates")}
                  style={{
                    padding: "12px 16px",
                    fontSize: "14px",
                    fontWeight: "600",
                    borderRadius: "8px",
                    backgroundColor: propertyAdType === "flatmates" ? "#eb6753" : "white",
                    color: propertyAdType === "flatmates" ? "white" : "#6B7280",
                    border: "1px solid #E5E7EB",
                    transition: "all 0.3s ease",
                  }}
                >
                  Flatmates
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="d-grid">
          <button
            type="submit"
            className="btn btn-lg"
            style={{
              backgroundColor: "#eb6753",
              color: "white",
              padding: "16px",
              fontSize: "16px",
              fontWeight: "600",
              borderRadius: "8px",
              border: "none",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#d94a36"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#eb6753"}
          >
            Start Posting Your Ad For FREE
          </button>
        </div>

        {/* Help Text */}
        <div className="text-center mt20">
          <p className="text-muted fz14 mb-0">
            <i className="flaticon-call me-2"></i>
            Give a missed call to 869-000-5267 to get help with your property listing.
          </p>
        </div>
      </form>
    </div>
  );
};

export default PostPropertyForm;
