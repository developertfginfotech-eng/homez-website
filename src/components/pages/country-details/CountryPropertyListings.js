"use client";

import { useEffect, useState } from "react";
import { getAllProperties } from "@/helpers/propertyApi";
import PropertyCard from "./PropertyCard";

const CountryPropertyListings = ({ country }) => {
  const [allProperties, setAllProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPropertyType, setSelectedPropertyType] = useState("all");
  const [selectedAdType, setSelectedAdType] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("newest");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const itemsPerPage = showAll ? 12 : 3; // Show 3 initially, 12 when "See More" is clicked

  // Helper function to match country name variations
  const matchesCountry = (propertyCountry, targetCountry) => {
    const countryVariations = {
      'United States': ['USA', 'US', 'United States', 'United States of America'],
      'United Arab Emirates': ['UAE', 'United Arab Emirates'],
      'United Kingdom': ['UK', 'United Kingdom', 'Great Britain'],
    };

    const targetLower = targetCountry.toLowerCase();
    const propertyLower = propertyCountry.toLowerCase();

    // Check if they match directly
    if (propertyLower === targetLower) return true;

    // Check variations
    for (const [key, variations] of Object.entries(countryVariations)) {
      if (key.toLowerCase() === targetLower) {
        return variations.some(v => v.toLowerCase() === propertyLower);
      }
      if (variations.some(v => v.toLowerCase() === targetLower)) {
        return variations.some(v => v.toLowerCase() === propertyLower) || key.toLowerCase() === propertyLower;
      }
    }

    return false;
  };

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getAllProperties();
        const countryProperties = data.filter(
          (property) => matchesCountry(property.country, country)
        );
        setAllProperties(countryProperties);
        setFilteredProperties(countryProperties);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setAllProperties([]);
        setFilteredProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [country]);

  // Apply filters
  useEffect(() => {
    let filtered = [...allProperties];

    // Category filter (residential/commercial)
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (property) => property.propertyCategory === selectedCategory
      );
    }

    // Property type filter (house/apartment/villa/etc.)
    if (selectedPropertyType !== "all") {
      filtered = filtered.filter(
        (property) => property.propertyType === selectedPropertyType
      );
    }

    // Ad type filter (rent/resale)
    if (selectedAdType !== "all") {
      filtered = filtered.filter(
        (property) => property.propertyAdType === selectedAdType
      );
    }

    // City filter
    if (selectedCity !== "all") {
      filtered = filtered.filter((property) => property.city === selectedCity);
    }

    // Price range filter
    if (priceRange.min !== "") {
      filtered = filtered.filter(
        (property) => property.price >= parseInt(priceRange.min)
      );
    }
    if (priceRange.max !== "") {
      filtered = filtered.filter(
        (property) => property.price <= parseInt(priceRange.max)
      );
    }

    // Sorting
    if (sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "oldest") {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredProperties(filtered);
    setCurrentPage(1);
  }, [
    selectedCategory,
    selectedPropertyType,
    selectedAdType,
    selectedCity,
    priceRange,
    sortBy,
    allProperties,
  ]);

  // Get unique values for filters
  const cities = [...new Set(allProperties.map((p) => p.city))].filter(Boolean);
  const propertyTypes = [
    ...new Set(allProperties.map((p) => p.propertyType)),
  ].filter(Boolean);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProperties = filteredProperties.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);

  const handleReset = () => {
    setSelectedCategory("all");
    setSelectedPropertyType("all");
    setSelectedAdType("all");
    setSelectedCity("all");
    setPriceRange({ min: "", max: "" });
    setSortBy("newest");
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-thm" role="status">
          <span className="visually-hidden">Loading properties...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        .results-count {
          font-size: 15px;
          color: #1f2937;
          margin-bottom: 20px;
          padding: 16px 20px;
          background: linear-gradient(135deg, rgba(235, 103, 83, 0.08) 0%, rgba(235, 103, 83, 0.03) 100%);
          border-radius: 16px;
          border-left: 4px solid #eb6753;
          box-shadow: 0 4px 12px rgba(235, 103, 83, 0.1);
          font-weight: 600;
        }

        .results-count strong {
          color: #eb6753;
          font-weight: 700;
          font-size: 18px;
        }

        .view-all-btn {
          width: 100%;
          padding: 18px;
          background: linear-gradient(135deg, #eb6753 0%, #dc3c28 100%);
          color: white;
          border: none;
          border-radius: 16px;
          font-size: 16px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          margin-top: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 8px 24px rgba(235, 103, 83, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1);
          position: relative;
          overflow: hidden;
          letter-spacing: 0.3px;
        }

        .view-all-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s ease;
        }

        .view-all-btn:hover::before {
          left: 100%;
        }

        .view-all-btn:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 12px 36px rgba(235, 103, 83, 0.4), 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .view-all-btn:active {
          transform: translateY(-2px) scale(0.98);
        }

        .view-all-btn i {
          font-size: 14px;
        }

        .property-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .load-more-btn {
          width: 100%;
          padding: 12px;
          background: #eb6753;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          margin-top: 20px;
        }

        .load-more-btn:hover {
          background: #dc3c28;
          transform: translateY(-2px);
        }

        .no-properties {
          text-align: center;
          padding: 40px 20px;
          background: white;
          border-radius: 12px;
        }
      `}</style>

      {/* Results Count */}
      <div className="results-count">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="fas fa-home" style={{ color: '#eb6753', fontSize: '16px' }}></i>
          <span>
            <strong>{filteredProperties.length}</strong> {filteredProperties.length === 1 ? 'property' : 'properties'} available
          </span>
        </div>
      </div>

      {/* Property List */}
      {currentProperties.length === 0 ? (
        <div className="no-properties">
          <i className="fas fa-home" style={{ fontSize: '40px', color: '#e5e7eb', marginBottom: '15px' }}></i>
          <h6 className="mb-2">No properties available</h6>
          <p className="text fz14 mb-0">Check back later for new listings</p>
        </div>
      ) : (
        <>
          <div className="property-list">
            {currentProperties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>

          {!showAll && filteredProperties.length > itemsPerPage && (
            <button
              className="view-all-btn"
              onClick={() => setShowAll(true)}
            >
              <span>See More Properties ({filteredProperties.length - 3} more in {country})</span>
              <i className="fas fa-arrow-right"></i>
            </button>
          )}

          {showAll && currentPage < totalPages && (
            <button
              className="load-more-btn"
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Load More ({filteredProperties.length - indexOfLastItem} remaining)
            </button>
          )}
        </>
      )}
    </>
  );
};

export default CountryPropertyListings;
