"use client";
import React, { useState, useRef } from "react";
import { chatAPI } from "@/services/chatApi";

// Map AI property types to local filter values
const PROPERTY_TYPE_MAP = {
  apartment: "Apartments",
  apartments: "Apartments",
  flat: "Apartments",
  house: "Houses",
  houses: "Houses",
  home: "Houses",
  villa: "Villa",
  villas: "Villa",
  office: "Office",
  commercial: "Office",
};

const HeroContent = ({ filterFunctions }) => {
  const [activeTab, setActiveTab] = useState("buy");
  const [searchValue, setSearchValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiMode, setAiMode] = useState(false);
  const [aiHint, setAiHint] = useState("");
  const recognitionRef = useRef(null);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (filterFunctions) {
      const statusMap = { buy: "Buy", rent: "Rent", sold: "Sold" };
      filterFunctions.handlelistingStatus(statusMap[tab]);
    }
  };

  const tabs = [
    { id: "buy", label: "Buy" },
    { id: "rent", label: "Rent" },
    { id: "sold", label: "Sold" },
  ];

  // Apply AI-parsed filters to the local filter system
  const applyAiFilters = (filters) => {
    if (!filterFunctions || !filters) return;

    // Bedrooms
    if (filters.bedrooms) {
      filterFunctions.handlebedrooms(filters.bedrooms);
    }

    // Bathrooms
    if (filters.bathrooms) {
      filterFunctions.handlebathroms(filters.bathrooms);
    }

    // Price range
    if (filters.minPrice || filters.maxPrice) {
      const min = filters.minPrice || 0;
      const max = filters.maxPrice || 100000000;
      filterFunctions.handlepriceRange([min, max]);
    }

    // Property type
    if (filters.propertyType) {
      const mapped = PROPERTY_TYPE_MAP[filters.propertyType.toLowerCase()];
      if (mapped) {
        filterFunctions.setPropertyTypes([mapped]);
      }
    }

    // Listing status (buy/rent)
    if (filters.propertyAdType) {
      const status = filters.propertyAdType.toLowerCase();
      if (status === "rent" || status === "for rent") {
        filterFunctions.handlelistingStatus("Rent");
        setActiveTab("rent");
      } else if (status === "buy" || status === "for sale" || status === "sale") {
        filterFunctions.handlelistingStatus("Buy");
        setActiveTab("buy");
      }
    }

    // Location — use city or locality for text search
    const locationText = filters.city || filters.locality || filters.state || "";
    if (locationText) {
      filterFunctions.setSearchQuery(locationText);
    }

    // Build a human-readable hint of what AI understood
    const parts = [];
    if (filters.bedrooms) parts.push(`${filters.bedrooms}+ bed`);
    if (filters.bathrooms) parts.push(`${filters.bathrooms}+ bath`);
    if (filters.propertyType) parts.push(filters.propertyType);
    if (locationText) parts.push(`in ${locationText}`);
    if (filters.maxPrice) parts.push(`under $${filters.maxPrice.toLocaleString()}`);
    if (parts.length > 0) {
      setAiHint(`AI understood: ${parts.join(", ")}`);
    }
  };

  // Smart AI search — detects NL queries and calls backend
  const handleSmartSearch = async (query) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    // Single word = plain city/address, no need for AI
    if (!trimmed.includes(" ")) {
      filterFunctions?.setSearchQuery(trimmed);
      setAiMode(false);
      setAiHint("");
      return;
    }

    setIsAiLoading(true);
    setAiMode(true);
    setAiHint("");

    try {
      const response = await chatAPI.sendMessage(trimmed, `search-${Date.now()}`, []);
      if (response.filters && Object.keys(response.filters).length > 0) {
        applyAiFilters(response.filters);
      } else {
        // No structured filters — fall back to text search
        filterFunctions?.setSearchQuery(trimmed);
        setAiHint("Showing results for: " + trimmed);
      }
    } catch {
      // Fallback silently
      filterFunctions?.setSearchQuery(trimmed);
      setAiMode(false);
      setAiHint("");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchValue(val);
    if (!val) {
      setAiMode(false);
      setAiHint("");
      filterFunctions?.setSearchQuery("");
    }
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    handleSmartSearch(searchValue);
  };

  // Voice search using browser Web Speech API
  const startVoiceSearch = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice search is not supported in your browser. Try Chrome or Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchValue(transcript);
      handleSmartSearch(transcript);
    };

    recognition.start();
  };

  return (
    <div className="advance-search-tab mt30 mx-auto animate-up-3">
      <ul className="nav nav-tabs p-0 m-0">
        {tabs.map((tab) => (
          <li className="nav-item" key={tab.id}>
            <button
              className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => handleTabClick(tab.id)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>

      <div className="tab-content">
        {tabs.map((tab) => (
          <div
            className={`${activeTab === tab.id ? "active" : ""} tab-pane`}
            key={tab.id}
          >
            <div className="advance-content-style1">
              <div className="row">
                <div className="col-md-8 col-lg-9">
                  <div className="advance-search-field position-relative text-start">
                    <form
                      className="form-search position-relative"
                      onSubmit={handleSearchSubmit}
                    >
                      <div className="box-search" style={{ position: "relative" }}>
                        <span className="icon flaticon-home-1" />
                        <input
                          className="form-control bgc-f7 bdrs12"
                          type="text"
                          name="search"
                          value={searchValue}
                          onChange={handleInputChange}
                          placeholder={`Try: "2 BHK under $500k in Dubai" or address`}
                          style={{ paddingRight: "76px" }}
                          onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit(e)}
                        />

                        {/* AI badge */}
                        {aiMode && !isAiLoading && (
                          <span
                            style={{
                              position: "absolute",
                              right: "46px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              background: "linear-gradient(135deg, #667eea, #764ba2)",
                              color: "#fff",
                              fontSize: "9px",
                              fontWeight: "700",
                              padding: "2px 6px",
                              borderRadius: "8px",
                              letterSpacing: "0.5px",
                              pointerEvents: "none",
                            }}
                          >
                            AI
                          </span>
                        )}

                        {/* Loading spinner inside input */}
                        {isAiLoading && (
                          <span
                            style={{
                              position: "absolute",
                              right: "46px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              width: "14px",
                              height: "14px",
                              border: "2px solid #764ba2",
                              borderTop: "2px solid transparent",
                              borderRadius: "50%",
                              display: "inline-block",
                              animation: "globperty-spin 0.7s linear infinite",
                            }}
                          />
                        )}

                        {/* Mic button */}
                        <button
                          type="button"
                          onClick={startVoiceSearch}
                          title={isListening ? "Stop listening" : "Voice search"}
                          style={{
                            position: "absolute",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: isListening
                              ? "#ef4444"
                              : "rgba(118,75,162,0.08)",
                            border: "none",
                            borderRadius: "50%",
                            width: "30px",
                            height: "30px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            color: isListening ? "#fff" : "#764ba2",
                            flexShrink: 0,
                          }}
                        >
                          {isListening ? (
                            /* Animated mic while recording */
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              style={{ animation: "globperty-pulse 1s infinite" }}
                            >
                              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                            </svg>
                          ) : (
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </form>

                    {/* AI hint / status line */}
                    {(isListening || aiHint) && (
                      <div
                        style={{
                          marginTop: "6px",
                          fontSize: "12px",
                          fontWeight: "500",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          color: isListening ? "#ef4444" : "#764ba2",
                        }}
                      >
                        <span
                          style={{
                            width: "7px",
                            height: "7px",
                            borderRadius: "50%",
                            background: "currentColor",
                            display: "inline-block",
                            animation: "globperty-pulse 1s infinite",
                          }}
                        />
                        {isListening ? "Listening... speak now" : aiHint}
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-md-4 col-lg-3">
                  <div className="d-flex align-items-center justify-content-start justify-content-md-center mt-3 mt-md-0">
                    <button
                      className="advance-search-btn"
                      type="button"
                      data-bs-toggle="modal"
                      data-bs-target="#advanceSeachModal"
                    >
                      <span className="flaticon-settings" /> Advanced
                    </button>
                    <button
                      className="advance-search-icon ud-btn btn-thm ms-4"
                      type="button"
                      onClick={handleSearchSubmit}
                      disabled={isAiLoading}
                      style={{ opacity: isAiLoading ? 0.7 : 1 }}
                    >
                      <span className="flaticon-search" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Keyframe animations injected once */}
      <style>{`
        @keyframes globperty-spin {
          to { transform: translateY(-50%) rotate(360deg); }
        }
        @keyframes globperty-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};

export default HeroContent;
