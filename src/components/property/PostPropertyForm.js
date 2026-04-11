"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Country-specific address field configurations
const getAddressFieldConfig = (country) => {
  const configs = {
    'UAE': {
      stateLabel: 'Emirate',
      statePlaceholder: 'Select emirate',
      hasPostalCode: false
    },
    'USA': {
      stateLabel: 'State',
      statePlaceholder: 'Select state',
      hasPostalCode: true,
      postalCodeLabel: 'ZIP Code',
      postalCodePlaceholder: 'Enter ZIP code'
    },
    'Portugal': {
      stateLabel: 'District',
      statePlaceholder: 'Select district',
      hasPostalCode: true,
      postalCodeLabel: 'Postal Code',
      postalCodePlaceholder: 'Enter postal code'
    },
    'Canada': {
      stateLabel: 'Province',
      statePlaceholder: 'Select province',
      hasPostalCode: true,
      postalCodeLabel: 'Postal Code',
      postalCodePlaceholder: 'Enter postal code'
    },
    'Australia': {
      stateLabel: 'State/Territory',
      statePlaceholder: 'Select state/territory',
      hasPostalCode: true,
      postalCodeLabel: 'Postcode',
      postalCodePlaceholder: 'Enter postcode'
    },
    'Turkey': {
      stateLabel: 'Province',
      statePlaceholder: 'Select province',
      hasPostalCode: true,
      postalCodeLabel: 'Postal Code',
      postalCodePlaceholder: 'Enter postal code'
    },
    'Cyprus': {
      stateLabel: 'District',
      statePlaceholder: 'Select district',
      hasPostalCode: true,
      postalCodeLabel: 'Postal Code',
      postalCodePlaceholder: 'Enter postal code'
    },
    'Malta': {
      stateLabel: 'Region',
      statePlaceholder: 'Select region',
      hasPostalCode: false
    },
    'Hungary': {
      stateLabel: 'County',
      statePlaceholder: 'Select county',
      hasPostalCode: true,
      postalCodeLabel: 'Postal Code',
      postalCodePlaceholder: 'Enter postal code'
    },
    'Latvia': {
      stateLabel: 'Municipality',
      statePlaceholder: 'Select municipality',
      hasPostalCode: true,
      postalCodeLabel: 'Postal Code',
      postalCodePlaceholder: 'Enter postal code'
    },
    'Philippines': {
      stateLabel: 'Province',
      statePlaceholder: 'Select province',
      hasPostalCode: true,
      postalCodeLabel: 'ZIP Code',
      postalCodePlaceholder: 'Enter ZIP code'
    },
    'Malaysia': {
      stateLabel: 'State',
      statePlaceholder: 'Select state',
      hasPostalCode: true,
      postalCodeLabel: 'Postcode',
      postalCodePlaceholder: 'Enter postcode'
    }
  };

  return configs[country] || {
    stateLabel: 'State/Province',
    statePlaceholder: 'Select state/province',
    hasPostalCode: true,
    postalCodeLabel: 'Postal Code',
    postalCodePlaceholder: 'Enter postal code'
  };
};

const PostPropertyForm = () => {
  const router = useRouter();

  // Check if user is admin
  const isAdmin = () => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.role === 'admin';
      }
    } catch (error) {
      console.error("Error checking user role:", error);
    }
    return false;
  };

  // Get user's country from localStorage - users can only post properties in their registered country
  // Admins can post in any country
  const getUserCountry = () => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        // If admin, default to UAE but allow changing
        return user.country || "UAE";
      }
    } catch (error) {
      console.error("Error getting user country:", error);
    }
    return "UAE";
  };

  const [selectedCountry, setSelectedCountry] = useState(getUserCountry());
  const [selectedState, setSelectedState] = useState("");
  const [propertyCategory, setPropertyCategory] = useState("residential");
  const [propertyAdType, setPropertyAdType] = useState("rent");
  const [userPropertiesCount, setUserPropertiesCount] = useState(0);
  const [kycVerified, setKycVerified] = useState(true); // Default to true for backward compatibility
  const [userIsAdmin] = useState(isAdmin()); // Store admin status

  // Country and States data - matching signup form countries
  const countryStateData = {
    UAE: [
      "Abu Dhabi",
      "Dubai",
      "Sharjah",
      "Ajman",
      "Umm Al Quwain",
      "Ras Al Khaimah",
      "Fujairah",
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
    Portugal: [
      "Aveiro",
      "Beja",
      "Braga",
      "Bragança",
      "Castelo Branco",
      "Coimbra",
      "Évora",
      "Faro",
      "Guarda",
      "Leiria",
      "Lisbon",
      "Portalegre",
      "Porto",
      "Santarém",
      "Setúbal",
      "Viana do Castelo",
      "Vila Real",
      "Viseu",
      "Azores",
      "Madeira",
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
    Turkey: [
      "Istanbul",
      "Ankara",
      "Izmir",
      "Antalya",
      "Bursa",
      "Adana",
      "Gaziantep",
      "Konya",
      "Mersin",
      "Kayseri",
    ],
    Cyprus: [
      "Nicosia",
      "Limassol",
      "Larnaca",
      "Paphos",
      "Famagusta",
      "Kyrenia",
    ],
    Malta: [
      "Valletta",
      "Mdina",
      "Sliema",
      "St. Julian's",
      "Gozo",
      "Comino",
    ],
    Hungary: [
      "Budapest",
      "Pest",
      "Bács-Kiskun",
      "Baranya",
      "Békés",
      "Borsod-Abaúj-Zemplén",
      "Csongrád",
      "Fejér",
      "Győr-Moson-Sopron",
      "Hajdú-Bihar",
    ],
    Latvia: [
      "Riga",
      "Daugavpils",
      "Liepāja",
      "Jelgava",
      "Jūrmala",
      "Ventspils",
      "Rēzekne",
      "Valmiera",
    ],
    Philippines: [
      "Metro Manila",
      "Cebu",
      "Davao",
      "Cagayan de Oro",
      "Iloilo",
      "Bacolod",
      "Baguio",
      "General Santos",
      "Quezon City",
      "Makati",
    ],
    Malaysia: [
      "Kuala Lumpur",
      "Selangor",
      "Penang",
      "Johor",
      "Perak",
      "Sabah",
      "Sarawak",
      "Melaka",
      "Negeri Sembilan",
      "Kedah",
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

        // Check KYC status and set user's country
        const kycStatus = localStorage.getItem("kycVerified");
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          setKycVerified(kycStatus === "true" || user.kycVerified === true);

          // Set country from user's account
          if (user.country) {
            setSelectedCountry(user.country);
          }
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

    // Validate all required fields with better error messages
    if (!selectedCountry || selectedCountry.length < 2) {
      alert("Please select a valid country. Your country is set from your account registration.");
      return;
    }

    if (!selectedState || selectedState.trim() === "") {
      alert(`Please select a ${getAddressFieldConfig(selectedCountry).stateLabel.toLowerCase()}. Type to search and select from the dropdown.`);
      return;
    }

    // Validate that selected state is valid (exists in the list)
    const isValidState = availableStates.includes(selectedState);
    if (!isValidState) {
      alert(`Please select a valid ${getAddressFieldConfig(selectedCountry).stateLabel.toLowerCase()} from the dropdown list.`);
      return;
    }

    if (!propertyAdType) {
      alert("Please select Rent or Resale to continue.");
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
            <span className="fw600" style={{ color: "#1F2937" }}>{userPropertiesCount} properties</span> on Globperty{" "}
            <Link href="/dashboard-my-properties" className="text-thm">
              view all
            </Link>
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Country Selector - Locked to user's registered country (except for admins) */}
        <div className="mb25">
          <label className="form-label fw600 mb10 fz14">
            Country
            {!userIsAdmin && <span className="text-muted fz12 ms-2">(From your account)</span>}
            {userIsAdmin && <span className="badge bg-success fz11 ms-2">Admin - Can select any country</span>}
          </label>
          <select
            className="form-select form-control"
            value={selectedCountry}
            onChange={handleCountryChange}
            disabled={!userIsAdmin}
            style={{
              padding: "12px 16px",
              fontSize: "14px",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              backgroundColor: "#F9FAFB",
              color: "#1F2937",
              cursor: "not-allowed",
            }}
          >
            {Object.keys(countryStateData).map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          {!userIsAdmin ? (
            <small className="text-muted fz12 mt-1 d-block">
              <i className="fas fa-info-circle me-1"></i>
              You can only post properties in your registered country
            </small>
          ) : (
            <small className="text-success fz12 mt-1 d-block">
              <i className="fas fa-crown me-1"></i>
              As an admin, you can post properties in any country
            </small>
          )}
        </div>

        {/* State/Province/Emirate Selector with Autocomplete */}
        <div className="mb25">
          <label className="form-label fw600 mb10 fz14">
            {getAddressFieldConfig(selectedCountry).stateLabel}
            <span className="text-danger ms-1">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            placeholder={`Type to search ${getAddressFieldConfig(selectedCountry).stateLabel.toLowerCase()}`}
            list="property-state-list"
            autoComplete="off"
            required
            style={{
              padding: "12px 16px",
              fontSize: "14px",
              border: selectedState ? "1px solid #10b981" : "1px solid #E5E7EB",
              borderRadius: "8px",
              backgroundColor: "white",
              color: "#1F2937",
            }}
          />
          <datalist id="property-state-list">
            {availableStates.map((state) => (
              <option key={state} value={state} />
            ))}
          </datalist>
          <small className="text-muted fz12 mt-1 d-block">
            <i className="fas fa-info-circle me-1"></i>
            Type to search and select from the dropdown
          </small>
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
          <label className="form-label fw600 mb10 fz14">
            Select Property Ad Type
            <span className="text-danger ms-1">*</span>
          </label>
          <small className="text-muted fz12 d-block mb-2">
            <i className="fas fa-info-circle me-1"></i>
            Choose whether you want to rent or sell your property
          </small>
          <div className="row g-3">
            {/* Rent - Show for Residential and Commercial */}
            {(propertyCategory === "residential" || propertyCategory === "commercial") && (
              <div className="col-6">
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
            <div className={`${propertyCategory === "land" ? "col-12" : "col-6"}`}>
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
