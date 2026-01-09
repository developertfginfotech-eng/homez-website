"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const HeroContent = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("buy");
  const [searchQuery, setSearchQuery] = useState("");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/grid-full-3-col?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const tabs = [
    { id: "buy", label: "Buy", icon: "fas fa-home" },
    { id: "rent", label: "Rent", icon: "fas fa-key" },
    { id: "pg", label: "PG", icon: "fas fa-bed" },
    { id: "commercial", label: "Commercial", icon: "fas fa-building" },
    { id: "plots", label: "Plots", icon: "fas fa-map" },
  ];

  return (
    <div className="nobroker-search-wrapper animate-up-3">
      {/* Property Type Tabs */}
      <div className="property-type-tabs mb30">
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`property-type-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => handleTabClick(tab.id)}
              style={{
                padding: "15px 30px",
                fontSize: "16px",
                fontWeight: "600",
                backgroundColor: activeTab === tab.id ? "#eb6753" : "white",
                color: activeTab === tab.id ? "white" : "#2d3748",
                border: activeTab === tab.id ? "2px solid #eb6753" : "2px solid #e5e7eb",
                borderRadius: "8px",
                transition: "all 0.3s ease",
                cursor: "pointer",
                minWidth: "120px",
              }}
            >
              <i className={`${tab.icon} me-2`}></i>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-bar-wrapper mx-auto" style={{ maxWidth: "900px" }}>
        <form onSubmit={handleSearch}>
          <div
            className="search-box-nobroker bgc-white p-3 bdrs12"
            style={{
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              border: "2px solid #f0f0f0"
            }}
          >
            <div className="row g-0 align-items-center">
              <div className="col-lg-9 col-md-8">
                <div className="search-input-wrapper d-flex align-items-center px-3">
                  <i className="fas fa-search text-muted me-3" style={{ fontSize: "20px" }}></i>
                  <input
                    type="text"
                    className="form-control border-0 shadow-none"
                    placeholder="Search for locality, landmark, project, or builder"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      fontSize: "16px",
                      padding: "12px 0",
                      fontWeight: "500"
                    }}
                  />
                </div>
              </div>
              <div className="col-lg-3 col-md-4">
                <button
                  type="submit"
                  className="btn w-100"
                  style={{
                    backgroundColor: "#eb6753",
                    color: "white",
                    padding: "15px 30px",
                    fontSize: "16px",
                    fontWeight: "600",
                    border: "none",
                    borderRadius: "8px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = "#d94a36"}
                  onMouseOut={(e) => e.target.style.backgroundColor = "#eb6753"}
                >
                  <i className="fas fa-search me-2"></i>
                  Search
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Popular Searches */}
        <div className="popular-searches mt-3 text-center">
          <span className="text-white me-3" style={{ fontSize: "14px", fontWeight: "500" }}>
            Popular Searches:
          </span>
          {["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Pune"].map((city, index) => (
            <button
              key={index}
              onClick={() => {
                setSearchQuery(city);
                router.push(`/grid-full-3-col?search=${encodeURIComponent(city)}`);
              }}
              className="btn btn-sm me-2 mb-2"
              style={{
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "20px",
                padding: "5px 15px",
                fontSize: "13px",
                fontWeight: "500",
              }}
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroContent;
